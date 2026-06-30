import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const rootDir = process.cwd();
const schemaDir = path.join(rootDir, "schemas", "jsonschema");
const fixtureDir = path.join(rootDir, "conformance", "fixtures", "v0.3");

const ajv = new Ajv2020({ allErrors: true, strict: false });
addFormats(ajv);

for (const fileName of fs.readdirSync(schemaDir)) {
  if (!fileName.endsWith(".json")) {
    continue;
  }

  const filePath = path.join(schemaDir, fileName);
  const schema = JSON.parse(fs.readFileSync(filePath, "utf8"));
  ajv.addSchema(schema, schema.$id || fileName);
  ajv.addSchema(schema, fileName);
}

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8"));
}

const relationshipRegistry = readJson("schemas/registry/core-relationship-vocabulary.json");
const relationshipRegistryIndex = new Map();
const relationshipAliasIndex = new Map();

for (const entry of relationshipRegistry.entries || []) {
  relationshipRegistryIndex.set(entry.canonical_code, entry);
  for (const alias of entry.aliases || []) {
    relationshipAliasIndex.set(alias, entry.canonical_code);
  }
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function validateFixture(testName, schemaFile, relativePath) {
  const validate = ajv.getSchema(schemaFile);
  const payload = readJson(relativePath);
  const valid = validate(payload);

  if (!valid) {
    const detail = ajv.errorsText(validate.errors, { separator: "\n" });
    throw new Error(`${testName} failed for ${relativePath}\n${detail}`);
  }

  return payload;
}

function expectInvalid(testName, schemaFile, relativePath, expectedFragment) {
  const validate = ajv.getSchema(schemaFile);
  const payload = readJson(relativePath);
  const valid = validate(payload);

  if (valid) {
    throw new Error(`${testName} unexpectedly passed for ${relativePath}`);
  }

  const detail = ajv.errorsText(validate.errors, { separator: "\n" });
  if (expectedFragment && !detail.includes(expectedFragment)) {
    throw new Error(`${testName} failed with unexpected validation error\n${detail}`);
  }
}

const unitCatalog = {
  BAR: { dimension: "pressure" },
  KPA: { dimension: "pressure" },
  PA: { dimension: "pressure" },
  DEG_F: { dimension: "temperature" },
  DEG_C: { dimension: "temperature" },
  GAL_US_PER_MIN: { dimension: "volumetric_flow_rate" },
  L_PER_S: { dimension: "volumetric_flow_rate" },
  STD_G: { dimension: "vibration_acceleration" },
  M_PER_S2: { dimension: "vibration_acceleration" },
  MM_PER_S: { dimension: "vibration_velocity" },
  PERCENT: { dimension: "valve_position_fraction_open" },
  MM: { dimension: "valve_travel_length" }
};

const quantityKindDimensions = {
  pressure: "pressure",
  temperature: "temperature",
  volumetric_flow_rate: "volumetric_flow_rate",
  vibration_velocity: "vibration_velocity",
  vibration_acceleration: "vibration_acceleration",
  valve_position_fraction_open: "valve_position_fraction_open",
  valve_travel_length: "valve_travel_length"
};

function getUnitDimension(unitRef, label) {
  assert(unitRef && unitRef.unit_code, `${label} must include a governed unit code.`);
  const unitInfo = unitCatalog[unitRef.unit_code];
  assert(unitInfo, `${label} uses unsupported or unknown unit code ${unitRef.unit_code}.`);
  return unitInfo.dimension;
}

function validateMeasurementObservation(testName, relativePath) {
  const observation = validateFixture(testName, "observation.json", relativePath);

  if (observation.original_measurement || observation.canonical_measurement) {
    assert(observation.original_measurement, `${testName} must preserve original measurement semantics.`);
    assert(observation.canonical_measurement, `${testName} must preserve canonical measurement semantics.`);
    assert(observation.measurement_quality, `${testName} must include structured measurement quality.`);
    assert(observation.signal_context, `${testName} must include signal semantics.`);
    assert(observation.time_synchronization_context, `${testName} must include time synchronization context.`);

    const quantityKind = observation.canonical_measurement.quantity_kind;
    const expectedDimension = quantityKindDimensions[quantityKind];
    assert(expectedDimension, `${testName} must use a governed quantity kind.`);

    const sourceDimension = getUnitDimension(observation.original_measurement.source_unit, `${testName} source unit`);
    const canonicalDimension = getUnitDimension(observation.canonical_measurement.canonical_unit, `${testName} canonical unit`);

    assert(
      sourceDimension === expectedDimension,
      `${testName} has incompatible quantity kinds or source units for ${quantityKind}.`
    );
    assert(
      canonicalDimension === expectedDimension,
      `${testName} has incompatible units for canonical quantity kind ${quantityKind}.`
    );

    assert(
      observation.conversion_lineage.source_unit.unit_code === observation.original_measurement.source_unit.unit_code,
      `${testName} conversion lineage must retain the original source unit.`
    );
    assert(
      observation.conversion_lineage.canonical_unit.unit_code === observation.canonical_measurement.canonical_unit.unit_code,
      `${testName} conversion lineage must retain the canonical unit.`
    );
  }

  if (!observation.calibration_context && observation.extensions && observation.extensions.calibration_note) {
    throw new Error(`${testName} must not use a free-form calibration note when structured calibration context is available.`);
  }

  return observation;
}

function expectInvalidMeasurementObservation(testName, relativePath, expectedFragment) {
  try {
    validateMeasurementObservation(testName, relativePath);
    throw new Error(`${testName} unexpectedly passed for ${relativePath}`);
  } catch (error) {
    const message = String(error.message || error);
    if (!message.includes(expectedFragment)) {
      throw new Error(`${testName} failed with unexpected validation error\n${message}`);
    }
  }
}

function parseTimestamp(value, label) {
  const parsed = Date.parse(value);
  assert(Number.isFinite(parsed), `${label} must be a valid date-time.`);
  return parsed;
}

function intervalBounds(record, startField = "valid_from", endField = "valid_to") {
  const start = record[startField] ? parseTimestamp(record[startField], `${startField} on ${record.assignment_id || record.asset_id || "record"}`) : Number.NEGATIVE_INFINITY;
  const end = record[endField] ? parseTimestamp(record[endField], `${endField} on ${record.assignment_id || record.asset_id || "record"}`) : Number.POSITIVE_INFINITY;
  assert(start <= end, `${record.assignment_id || record.asset_id || "record"} has an invalid validity period.`);
  return { start, end };
}

function intervalsOverlap(left, right) {
  return left.start <= right.end && right.start <= left.end;
}

function validateIdentityBundle(testName, relativePath) {
  const payload = readJson(relativePath);
  const assets = payload.assets || [];
  const functionalLocations = payload.functional_locations || [];
  const relationships = payload.relationships || [];
  const events = payload.identity_lifecycle_events || [];

  for (const [index, asset] of assets.entries()) {
    const validate = ajv.getSchema("asset.json");
    const valid = validate(asset);
    if (!valid) {
      const detail = ajv.errorsText(validate.errors, { separator: "\n" });
      throw new Error(`${testName} asset ${index + 1} failed validation\n${detail}`);
    }
  }

  for (const [index, relationship] of relationships.entries()) {
    const validate = ajv.getSchema("relationship.json");
    const valid = validate(relationship);
    if (!valid) {
      const detail = ajv.errorsText(validate.errors, { separator: "\n" });
      throw new Error(`${testName} relationship ${index + 1} failed validation\n${detail}`);
    }
  }

  for (const [index, location] of functionalLocations.entries()) {
    const validate = ajv.getSchema("functional-location.json");
    const valid = validate(location);
    if (!valid) {
      const detail = ajv.errorsText(validate.errors, { separator: "\n" });
      throw new Error(`${testName} functional location ${index + 1} failed validation\n${detail}`);
    }
  }

  for (const [index, event] of events.entries()) {
    const validate = ajv.getSchema("identity-lifecycle-event.json");
    const valid = validate(event);
    if (!valid) {
      const detail = ajv.errorsText(validate.errors, { separator: "\n" });
      throw new Error(`${testName} identity lifecycle event ${index + 1} failed validation\n${detail}`);
    }
  }

  return payload;
}

function ensureUniqueCanonicalIds(assets) {
  const seen = new Set();
  for (const asset of assets) {
    assert(!seen.has(asset.asset_id), `Canonical SSOM asset identifier ${asset.asset_id} must not be reused.`);
    seen.add(asset.asset_id);
  }
}

function ensureAssignmentValidity(assets) {
  for (const asset of assets) {
    const assignments = asset.identity?.identifier_assignments || [];
    for (const assignment of assignments) {
      intervalBounds(assignment);
      if (assignment.identifier_role === "functional_location_reference") {
        assert(
          assignment.semantic_usage === "contextual_reference",
          `${assignment.assignment_id} must treat functional location as a contextual reference rather than asset identity.`
        );
      }
      assert(
        assignment.identifier_role !== "canonical_ssom_id",
        `${assignment.assignment_id} must not restate the canonical SSOM ID as a reusable external identifier assignment.`
      );
    }
  }
}

function ensureNoOverlappingAssignments(assets) {
  const entries = [];
  for (const asset of assets) {
    const assignments = asset.identity?.identifier_assignments || [];
    for (const assignment of assignments) {
      entries.push({ asset_id: asset.asset_id, assignment, bounds: intervalBounds(assignment) });
    }
  }

  for (let i = 0; i < entries.length; i += 1) {
    for (let j = i + 1; j < entries.length; j += 1) {
      const left = entries[i];
      const right = entries[j];
      if (left.asset_id === right.asset_id) {
        continue;
      }
      if (left.assignment.identifier_value !== right.assignment.identifier_value) {
        continue;
      }
      if (left.assignment.identifier_role !== right.assignment.identifier_role) {
        continue;
      }
      if (left.assignment.identifier_scope.scope_type !== right.assignment.identifier_scope.scope_type) {
        continue;
      }
      if (left.assignment.identifier_scope.scope_value !== right.assignment.identifier_scope.scope_value) {
        continue;
      }
      if (left.assignment.identifier_authority.authority_id !== right.assignment.identifier_authority.authority_id) {
        continue;
      }
      if (
        left.assignment.semantic_usage === "contextual_reference" ||
        right.assignment.semantic_usage === "contextual_reference"
      ) {
        continue;
      }
      assert(
        !intervalsOverlap(left.bounds, right.bounds),
        `Identifier ${left.assignment.identifier_value} overlaps across assets ${left.asset_id} and ${right.asset_id} within the same scope and authority.`
      );
    }
  }
}

function ensureSuccessionRelationships(relationships) {
  const successionTypes = new Set([
    "replaces",
    "replaced_by",
    "succeeds",
    "preceded_by",
    "split_into",
    "merged_from",
    "decommissioned_as",
    "recommissioned_as"
  ]);

  for (const relationship of relationships) {
    if (!successionTypes.has(relationship.relationship_type)) {
      continue;
    }
    assert(
      relationship.from_ref !== relationship.to_ref,
      `Succession relationship ${relationship.relationship_id} must not self-reference.`
    );
  }
}

function expectInvalidIdentityBundle(testName, relativePath, expectedFragment) {
  try {
    const payload = validateIdentityBundle(testName, relativePath);
    ensureUniqueCanonicalIds(payload.assets || []);
    ensureAssignmentValidity(payload.assets || []);
    ensureNoOverlappingAssignments(payload.assets || []);
    ensureSuccessionRelationships(payload.relationships || []);
    throw new Error(`${testName} unexpectedly passed for ${relativePath}`);
  } catch (error) {
    const message = String(error.message || error);
    if (!message.includes(expectedFragment)) {
      throw new Error(`${testName} failed with unexpected validation error\n${message}`);
    }
  }
}

function validateSchemaEntries(testName, schemaFile, entries, label) {
  const validate = ajv.getSchema(schemaFile);
  for (const [index, entry] of entries.entries()) {
    const valid = validate(entry);
    if (!valid) {
      const detail = ajv.errorsText(validate.errors, { separator: "\n" });
      throw new Error(`${testName} ${label} ${index + 1} failed validation\n${detail}`);
    }
  }
}

function validateReliabilityBundle(testName, relativePath) {
  const payload = readJson(relativePath);
  const sections = [
    ["observations", "observation.json", "observation"],
    ["conditions", "condition.json", "condition"],
    ["symptoms", "symptom.json", "symptom"],
    ["failure_modes", "failure-mode.json", "failure mode"],
    ["failure_mechanisms", "failure-mechanism.json", "failure mechanism"],
    ["failure_causes", "failure-cause.json", "failure cause"],
    ["failure_events", "failure-event.json", "failure event"],
    ["diagnostics", "diagnostic.json", "diagnostic"],
    ["prognostics", "prognostic.json", "prognostic"],
    ["maintenance_strategies", "maintenance-strategy.json", "maintenance strategy"],
    ["recommendations", "recommendation.json", "recommendation"],
    ["decisions", "decision.json", "decision"],
    ["work_requests", "work-request.json", "work request"],
    ["work_plans", "work-plan.json", "work plan"],
    ["work_executions", "work-execution.json", "work execution"],
    ["work_verifications", "work-verification.json", "work verification"],
    ["work_outcomes", "work-outcome.json", "work outcome"]
  ];

  for (const [key, schemaFile, label] of sections) {
    validateSchemaEntries(testName, schemaFile, payload[key] || [], label);
  }

  return payload;
}

function ensureReliabilityReferences(bundle, testName) {
  const knownIds = new Set();
  const collect = (entries, idField) => {
    for (const entry of entries || []) {
      knownIds.add(entry[idField]);
    }
  };

  collect(bundle.observations, "record_id");
  collect(bundle.conditions, "condition_id");
  collect(bundle.symptoms, "symptom_id");
  collect(bundle.failure_modes, "failure_mode_id");
  collect(bundle.failure_mechanisms, "failure_mechanism_id");
  collect(bundle.failure_causes, "failure_cause_id");
  collect(bundle.failure_events, "failure_event_id");
  collect(bundle.diagnostics, "diagnostic_id");
  collect(bundle.prognostics, "prognostic_id");
  collect(bundle.maintenance_strategies, "strategy_id");
  collect(bundle.recommendations, "recommendation_id");
  collect(bundle.decisions, "decision_id");
  collect(bundle.work_requests, "work_request_id");
  collect(bundle.work_plans, "work_plan_id");
  collect(bundle.work_executions, "action_id");
  collect(bundle.work_verifications, "verification_id");
  collect(bundle.work_outcomes, "outcome_id");

  const workExecutions = new Map((bundle.work_executions || []).map((entry) => [entry.action_id, entry]));
  const workVerifications = new Map((bundle.work_verifications || []).map((entry) => [entry.verification_id, entry]));

  for (const verification of bundle.work_verifications || []) {
    assert(workExecutions.has(verification.work_execution_ref), `${testName} work verification must reference an existing work execution.`);
  }

  for (const outcome of bundle.work_outcomes || []) {
    assert(workExecutions.has(outcome.work_execution_ref), `${testName} work outcome must reference an existing work execution.`);
    assert(outcome.action_ref === outcome.work_execution_ref, `${testName} work outcome must reuse the action reference of the work execution.`);
    for (const verificationRef of outcome.verification_refs || []) {
      const verification = workVerifications.get(verificationRef);
      assert(verification, `${testName} work outcome must reference work verification evidence.`);
      assert(
        verification.work_execution_ref === outcome.work_execution_ref,
        `${testName} work outcome verification evidence must validate the same work execution.`
      );
    }
    if (outcome.reliability_impact) {
      for (const measurementRef of outcome.reliability_impact.measurement_evidence_refs) {
        assert(knownIds.has(measurementRef), `${testName} reliability impact must reference known measurement or evidence records.`);
      }
      for (const workRef of outcome.reliability_impact.work_history_refs) {
        assert(knownIds.has(workRef), `${testName} reliability impact must reference known work history.`);
      }
    }
  }

  for (const diagnostic of bundle.diagnostics || []) {
    if (diagnostic.extensions && diagnostic.extensions.failure_summary_text) {
      assert(
        diagnostic.failure_mode_ref || diagnostic.failure_mechanism_ref || diagnostic.failure_cause_ref || diagnostic.symptom_refs,
        `${testName} failure mode, mechanism, and cause cannot be collapsed into one uncontrolled text field.`
      );
    }
  }
}

function expectInvalidReliabilityBundle(testName, relativePath, expectedFragment) {
  try {
    const payload = validateReliabilityBundle(testName, relativePath);
    ensureReliabilityReferences(payload, testName);
    throw new Error(`${testName} unexpectedly passed for ${relativePath}`);
  } catch (error) {
    const message = String(error.message || error);
    if (!message.includes(expectedFragment)) {
      throw new Error(`${testName} failed with unexpected validation error\n${message}`);
    }
  }
}

function validateEventAlarmBundle(testName, relativePath) {
  const payload = readJson(relativePath);
  const sections = [
    ["observations", "observation.json", "observation"],
    ["conditions", "condition.json", "condition"],
    ["events", "event.json", "event"],
    ["alarms", "alarm.json", "alarm"],
    ["state_transitions", "state-transition.json", "state transition"],
    ["recommendations", "recommendation.json", "recommendation"],
    ["work_requests", "work-request.json", "work request"],
    ["work_plans", "work-plan.json", "work plan"],
    ["work_executions", "work-execution.json", "work execution"],
    ["work_verifications", "work-verification.json", "work verification"]
  ];

  for (const [key, schemaFile, label] of sections) {
    validateSchemaEntries(testName, schemaFile, payload[key] || [], label);
  }

  return payload;
}

function ensureKnownRefs(refs, knownIds, testName, message) {
  for (const ref of refs || []) {
    assert(knownIds.has(ref), `${testName} ${message}`);
  }
}

function ensureEventAlarmSemantics(bundle, testName) {
  const knownIds = new Set();
  const collect = (entries, idField) => {
    for (const entry of entries || []) {
      knownIds.add(entry[idField]);
    }
  };

  collect(bundle.observations, "record_id");
  collect(bundle.conditions, "condition_id");
  collect(bundle.events, "event_id");
  collect(bundle.alarms, "alarm_id");
  collect(bundle.state_transitions, "transition_id");
  collect(bundle.recommendations, "recommendation_id");
  collect(bundle.work_requests, "work_request_id");
  collect(bundle.work_plans, "work_plan_id");
  collect(bundle.work_executions, "action_id");
  collect(bundle.work_verifications, "verification_id");

  const eventIds = new Set((bundle.events || []).map((entry) => entry.event_id));
  const observationIds = new Set((bundle.observations || []).map((entry) => entry.record_id));
  const conditionIds = new Set((bundle.conditions || []).map((entry) => entry.condition_id));
  const workIds = new Set([
    ...(bundle.work_requests || []).map((entry) => entry.work_request_id),
    ...(bundle.work_plans || []).map((entry) => entry.work_plan_id),
    ...(bundle.work_executions || []).map((entry) => entry.action_id)
  ]);
  const workExecutions = new Map((bundle.work_executions || []).map((entry) => [entry.action_id, entry]));

  for (const observation of bundle.observations || []) {
    assert(
      !observation.extensions?.uncontrolled_alarm_text,
      `${testName} alarm semantics must not be represented solely as uncontrolled string content in Observation.`
    );
  }

  for (const condition of bundle.conditions || []) {
    assert(
      !condition.extensions?.uncontrolled_alarm_text,
      `${testName} alarm semantics must not be represented solely as uncontrolled string content in Condition.`
    );
  }

  for (const event of bundle.events || []) {
    if (event.related_refs) {
      ensureKnownRefs(event.related_refs, knownIds, testName, `event ${event.event_id} must reference known prior evidence.`);
    }
    if (event.source_payload) {
      assert(
        event.source_payload.payload || event.source_payload.payload_reference,
        `${testName} event ${event.event_id} must preserve source payload content or a durable payload reference.`
      );
    }
    if (event.state_transition) {
      assert(
        event.state_transition.from_state !== event.state_transition.to_state,
        `${testName} event ${event.event_id} state transition must change state.`
      );
      assert(
        event.state_transition.event_time === event.event_time,
        `${testName} event ${event.event_id} state transition must preserve the same event time as the event.`
      );
      if (event.state_transition.valid_from && event.state_transition.valid_to) {
        intervalBounds(event.state_transition);
      }
      ensureKnownRefs(
        event.state_transition.evidence_refs,
        knownIds,
        testName,
        `event ${event.event_id} state transition must reference known evidence.`
      );
    }
    if (event.temporal_integrity.delivery_classification === "late_arrival") {
      const eventTime = parseTimestamp(event.temporal_integrity.event_time, `${event.event_id} event_time`);
      const receiveTime = parseTimestamp(event.temporal_integrity.receive_time, `${event.event_id} receive_time`);
      assert(receiveTime > eventTime, `${testName} late-arriving event ${event.event_id} must preserve later receive time than event time.`);
    }
  }

  for (const transition of bundle.state_transitions || []) {
    assert(transition.from_state !== transition.to_state, `${testName} state transition ${transition.transition_id} must change state.`);
    if (transition.valid_from && transition.valid_to) {
      intervalBounds(transition);
    }
    if (transition.source_ref) {
      assert(knownIds.has(transition.source_ref), `${testName} state transition ${transition.transition_id} must reference a known source record.`);
    }
    ensureKnownRefs(
      transition.evidence_refs,
      knownIds,
      testName,
      `state transition ${transition.transition_id} must reference known evidence.`
    );
  }

  for (const alarm of bundle.alarms || []) {
    if (alarm.event_ref) {
      assert(eventIds.has(alarm.event_ref), `${testName} alarm ${alarm.alarm_id} must reference a known event.`);
    }
    if (alarm.observation_ref) {
      assert(observationIds.has(alarm.observation_ref), `${testName} alarm ${alarm.alarm_id} must reference a known observation.`);
    }
    if (alarm.condition_ref) {
      assert(conditionIds.has(alarm.condition_ref), `${testName} alarm ${alarm.alarm_id} must reference a known condition.`);
    }
    if (alarm.source_payload) {
      assert(
        alarm.source_payload.payload || alarm.source_payload.payload_reference,
        `${testName} alarm ${alarm.alarm_id} must preserve source payload content or a durable payload reference.`
      );
    }
    if (alarm.lifecycle) {
      assert(
        alarm.lifecycle.canonical_alarm_state === alarm.alarm_state,
        `${testName} alarm ${alarm.alarm_id} lifecycle state must match the canonical alarm state.`
      );
      let previousTransitionTime = Number.NEGATIVE_INFINITY;
      const transitions = alarm.lifecycle.state_transitions || [];
      for (const transition of transitions) {
        assert(
          transition.from_state !== transition.to_state,
          `${testName} alarm ${alarm.alarm_id} transition history must change state.`
        );
        const transitionTime = parseTimestamp(transition.event_time, `${alarm.alarm_id} transition event_time`);
        assert(
          transitionTime >= previousTransitionTime,
          `${testName} alarm ${alarm.alarm_id} transition history must remain time-ordered.`
        );
        previousTransitionTime = transitionTime;
        if (transition.valid_from && transition.valid_to) {
          intervalBounds(transition);
        }
        if (transition.source_event_ref) {
          assert(
            eventIds.has(transition.source_event_ref),
            `${testName} alarm ${alarm.alarm_id} transition must reference a known source event.`
          );
        }
        ensureKnownRefs(
          transition.evidence_refs,
          knownIds,
          testName,
          `alarm ${alarm.alarm_id} transition must reference known evidence.`
        );
      }
      if (transitions.length > 0) {
        assert(
          transitions[transitions.length - 1].to_state === alarm.alarm_state,
          `${testName} alarm ${alarm.alarm_id} final transition state must match the canonical alarm state.`
        );
      }
    }
    if (alarm.alarm_state === "suppressed" || alarm.alarm_state === "shelved") {
      assert(alarm.suppression_context, `${testName} alarm ${alarm.alarm_id} must retain suppression or shelving context.`);
      assert(alarm.suppression_context.valid_from, `${testName} alarm ${alarm.alarm_id} suppression or shelving must retain a valid-from timestamp.`);
      assert(alarm.suppression_context.valid_to, `${testName} alarm ${alarm.alarm_id} suppression or shelving must retain a valid-to timestamp.`);
      intervalBounds(alarm.suppression_context);
      if (alarm.suppression_context.work_context_ref) {
        assert(
          workIds.has(alarm.suppression_context.work_context_ref),
          `${testName} alarm ${alarm.alarm_id} suppression work context must reference known work context.`
        );
      }
    }
    if (alarm.cleared_at) {
      assert(alarm.alarm_state === "cleared", `${testName} alarm ${alarm.alarm_id} cleared_at requires canonical cleared state.`);
    }
  }

  for (const request of bundle.work_requests || []) {
    ensureKnownRefs(request.basis_refs, knownIds, testName, `work request ${request.work_request_id} must reference known basis records.`);
  }

  const workPlans = new Map((bundle.work_plans || []).map((entry) => [entry.work_plan_id, entry]));
  for (const execution of bundle.work_executions || []) {
    assert(workIds.has(execution.work_request_ref), `${testName} work execution ${execution.action_id} must reference known work request context.`);
    assert(workPlans.has(execution.work_plan_ref), `${testName} work execution ${execution.action_id} must reference known work plan context.`);
    ensureKnownRefs(execution.basis_refs, knownIds, testName, `work execution ${execution.action_id} must reference known basis records.`);
  }

  for (const verification of bundle.work_verifications || []) {
    assert(
      workExecutions.has(verification.work_execution_ref),
      `${testName} work verification ${verification.verification_id} must reference an existing work execution.`
    );
    ensureKnownRefs(
      verification.evidence_refs,
      knownIds,
      testName,
      `work verification ${verification.verification_id} must reference known evidence.`
    );
  }
}

function expectInvalidEventAlarmBundle(testName, relativePath, expectedFragment) {
  try {
    const payload = validateEventAlarmBundle(testName, relativePath);
    ensureEventAlarmSemantics(payload, testName);
    throw new Error(`${testName} unexpectedly passed for ${relativePath}`);
  } catch (error) {
    const message = String(error.message || error);
    if (!message.includes(expectedFragment)) {
      throw new Error(`${testName} failed with unexpected validation error\n${message}`);
    }
  }
}

function validateRegistryFile(testName, schemaFile, relativePath) {
  const validate = ajv.getSchema(schemaFile);
  const payload = readJson(relativePath);
  const valid = validate(payload);

  if (!valid) {
    const detail = ajv.errorsText(validate.errors, { separator: "\n" });
    throw new Error(`${testName} failed for ${relativePath}\n${detail}`);
  }

  return payload;
}

function normalizeRelationshipType(relationshipType) {
  if (relationshipRegistryIndex.has(relationshipType)) {
    return relationshipType;
  }
  return relationshipAliasIndex.get(relationshipType) || relationshipType;
}

function getAssetEntityKinds(asset) {
  const kinds = new Set(["asset_instance"]);

  if (Array.isArray(asset.equipment_roles) && asset.equipment_roles.length > 0) {
    kinds.add("equipment_asset");
  }
  if (Array.isArray(asset.device_roles) && asset.device_roles.length > 0) {
    kinds.add("device_asset");
  }

  switch (asset.asset_form) {
    case "component":
      kinds.add("component_asset");
      break;
    case "assembly":
      kinds.add("assembly_asset");
      break;
    case "instrument":
      kinds.add("instrument_asset");
      break;
    case "controller":
      kinds.add("controller_asset");
      break;
    case "logical_asset":
      kinds.add("logical_asset_instance");
      break;
    case "system":
      kinds.add("system");
      break;
    default:
      break;
  }

  return kinds;
}

function addEntityKinds(catalog, ref, kinds) {
  if (!catalog.has(ref)) {
    catalog.set(ref, new Set());
  }
  const existing = catalog.get(ref);
  for (const kind of kinds) {
    existing.add(kind);
  }
}

function validateRelationshipBundle(testName, relativePath) {
  const payload = readJson(relativePath);
  const sections = [
    ["asset_classes", "asset-class.json", "asset class"],
    ["equipment_models", "equipment-model.json", "equipment model"],
    ["operational_boundaries", "operational-boundary.json", "operational boundary"],
    ["functional_locations", "functional-location.json", "functional location"],
    ["assets", "asset.json", "asset"],
    ["conditions", "condition.json", "condition"],
    ["failure_modes", "failure-mode.json", "failure mode"],
    ["work_executions", "work-execution.json", "work execution"],
    ["relationships", "relationship.json", "relationship"]
  ];

  for (const [key, schemaFile, label] of sections) {
    validateSchemaEntries(testName, schemaFile, payload[key] || [], label);
  }

  return payload;
}

function validateRelationshipRegistrySemantics(testName, registry) {
  const seen = new Set();
  for (const entry of registry.entries || []) {
    assert(!seen.has(entry.canonical_code), `${testName} duplicate canonical relationship code ${entry.canonical_code} is not allowed.`);
    seen.add(entry.canonical_code);
    const inverse = registry.entries.find((candidate) => candidate.canonical_code === entry.inverse_code);
    assert(inverse, `${testName} inverse relationship ${entry.inverse_code} must exist in the registry.`);
    for (const alias of entry.aliases || []) {
      assert(alias !== entry.canonical_code, `${testName} alias ${alias} must not duplicate the canonical relationship code.`);
    }
  }
}

function buildRelationshipEntityCatalog(bundle, testName) {
  const catalog = new Map();
  const assetClassIds = new Set((bundle.asset_classes || []).map((entry) => entry.class_id));
  const equipmentModelIds = new Set((bundle.equipment_models || []).map((entry) => entry.model_id));
  const boundaryIds = new Set((bundle.operational_boundaries || []).map((entry) => entry.boundary_id));
  const locationIds = new Set((bundle.functional_locations || []).map((entry) => entry.location_id));
  const assetIds = new Set((bundle.assets || []).map((entry) => entry.asset_id));

  for (const assetClass of bundle.asset_classes || []) {
    addEntityKinds(catalog, assetClass.class_id, ["asset_class"]);
    if (assetClass.parent_class_ref) {
      assert(assetClassIds.has(assetClass.parent_class_ref), `${testName} asset class ${assetClass.class_id} must reference a known parent asset class.`);
    }
  }

  for (const equipmentModel of bundle.equipment_models || []) {
    addEntityKinds(catalog, equipmentModel.model_id, ["equipment_model"]);
    if (equipmentModel.asset_class_ref) {
      assert(assetClassIds.has(equipmentModel.asset_class_ref), `${testName} equipment model ${equipmentModel.model_id} must reference a known asset class.`);
    }
  }

  for (const boundary of bundle.operational_boundaries || []) {
    addEntityKinds(catalog, boundary.boundary_id, [boundary.boundary_type]);
    if (boundary.parent_boundary_ref) {
      assert(boundaryIds.has(boundary.parent_boundary_ref), `${testName} boundary ${boundary.boundary_id} must reference a known parent boundary.`);
    }
    if (boundary.managed_as_asset_ref) {
      assert(assetIds.has(boundary.managed_as_asset_ref), `${testName} boundary ${boundary.boundary_id} managed asset reference must point to a known asset.`);
    }
  }

  for (const location of bundle.functional_locations || []) {
    addEntityKinds(catalog, location.location_id, ["functional_location"]);
    if (location.parent_location_ref) {
      assert(locationIds.has(location.parent_location_ref), `${testName} functional location ${location.location_id} must reference a known parent functional location.`);
    }
  }

  for (const asset of bundle.assets || []) {
    addEntityKinds(catalog, asset.asset_id, getAssetEntityKinds(asset));
    if (asset.asset_class_ref) {
      assert(assetClassIds.has(asset.asset_class_ref), `${testName} asset ${asset.asset_id} must reference a known asset class.`);
    }
    if (asset.equipment_model_ref) {
      assert(equipmentModelIds.has(asset.equipment_model_ref), `${testName} asset ${asset.asset_id} must reference a known equipment model.`);
    }
  }

  for (const condition of bundle.conditions || []) {
    addEntityKinds(catalog, condition.condition_id, ["condition"]);
  }

  for (const failureMode of bundle.failure_modes || []) {
    addEntityKinds(catalog, failureMode.failure_mode_id, ["failure_mode"]);
  }

  for (const workExecution of bundle.work_executions || []) {
    addEntityKinds(catalog, workExecution.action_id, ["work_execution"]);
  }

  return catalog;
}

function relationshipKindsMatch(kinds, permittedKinds) {
  for (const kind of kinds) {
    if (permittedKinds.includes(kind)) {
      return true;
    }
  }
  return false;
}

function ensureRelationshipSemantics(bundle, testName) {
  const entityCatalog = buildRelationshipEntityCatalog(bundle, testName);
  const relationships = bundle.relationships || [];

  for (const relationship of relationships) {
    if (relationship.valid_from && relationship.valid_to) {
      intervalBounds(relationship);
    }

    const normalizedType = normalizeRelationshipType(relationship.relationship_type);
    const registryEntry = relationshipRegistryIndex.get(normalizedType);
    const fromKinds = entityCatalog.get(relationship.from_ref);
    const toKinds = entityCatalog.get(relationship.to_ref);

    assert(fromKinds, `${testName} relationship ${relationship.relationship_id} must reference a known subject.`);
    assert(toKinds, `${testName} relationship ${relationship.relationship_id} must reference a known object.`);

    if (registryEntry) {
      assert(
        relationshipKindsMatch(fromKinds, registryEntry.permitted_subject_types),
        `${testName} relationship ${relationship.relationship_id} uses unsupported subject/object domain for ${normalizedType}.`
      );
      assert(
        relationshipKindsMatch(toKinds, registryEntry.permitted_object_types),
        `${testName} relationship ${relationship.relationship_id} uses unsupported subject/object domain for ${normalizedType}.`
      );
      assert(
        registryEntry.allow_self_reference || relationship.from_ref !== relationship.to_ref,
        `${testName} relationship ${relationship.relationship_id} must not self-reference for ${normalizedType}.`
      );
      if (relationship.direction) {
        assert(
          relationship.direction === registryEntry.direction,
          `${testName} relationship ${relationship.relationship_id} must align with the governed relationship direction for ${normalizedType}.`
        );
      }
      if (relationship.relationship_mapping?.normalized_relationship_type) {
        const mapped = normalizeRelationshipType(relationship.relationship_mapping.normalized_relationship_type);
        assert(
          mapped === normalizedType,
          `${testName} relationship ${relationship.relationship_id} mapping must normalize to the governed relationship code in use.`
        );
      }
    } else {
      assert(
        relationship.relationship_mapping,
        `${testName} extension relationship ${relationship.relationship_id} must include mapping metadata.`
      );
      assert(
        relationship.relationship_type.includes(":"),
        `${testName} extension relationship ${relationship.relationship_id} must be namespaced.`
      );
      assert(
        relationship.relationship_mapping.extension_namespace,
        `${testName} extension relationship ${relationship.relationship_id} must declare an extension namespace.`
      );
    }
  }

  for (let i = 0; i < relationships.length; i += 1) {
    for (let j = i + 1; j < relationships.length; j += 1) {
      const left = relationships[i];
      const right = relationships[j];
      if (left.from_ref !== right.to_ref || left.to_ref !== right.from_ref) {
        continue;
      }
      const leftType = normalizeRelationshipType(left.relationship_type);
      const rightType = normalizeRelationshipType(right.relationship_type);
      const leftEntry = relationshipRegistryIndex.get(leftType);
      const rightEntry = relationshipRegistryIndex.get(rightType);
      if (!leftEntry || !rightEntry) {
        continue;
      }
      if (leftEntry.direction === "undirected" && rightEntry.direction === "undirected") {
        continue;
      }
      assert(
        leftEntry.inverse_code === rightType && rightEntry.inverse_code === leftType,
        `${testName} reverse relationship usage between ${left.relationship_id} and ${right.relationship_id} must use a known inverse pair.`
      );
    }
  }
}

function expectInvalidRelationshipBundle(testName, relativePath, expectedFragment) {
  try {
    const payload = validateRelationshipBundle(testName, relativePath);
    ensureRelationshipSemantics(payload, testName);
    throw new Error(`${testName} unexpectedly passed for ${relativePath}`);
  } catch (error) {
    const message = String(error.message || error);
    if (!message.includes(expectedFragment)) {
      throw new Error(`${testName} failed with unexpected validation error\n${message}`);
    }
  }
}

const results = [];

const registryPayload = validateRegistryFile(
  "core relationship registry",
  "relationship-registry.json",
  "schemas/registry/core-relationship-vocabulary.json"
);
validateRelationshipRegistrySemantics("core relationship registry", registryPayload);
results.push("core relationship registry remains machine-readable, reciprocal, and alias-governed");

const pump = validateFixture(
  "equipment-only asset",
  "asset.json",
  "conformance/fixtures/v0.3/valid/asset-pump-p101.json"
);
assert(Array.isArray(pump.equipment_roles) && pump.equipment_roles.length > 0, "Pump fixture must retain equipment roles.");
assert(!pump.device_roles || pump.device_roles.length === 0, "Pump fixture must remain equipment-only.");
results.push("asset may carry equipment roles only");

const plc = validateFixture(
  "device-only asset",
  "asset.json",
  "conformance/fixtures/v0.3/valid/asset-plc-17.json"
);
assert(Array.isArray(plc.device_roles) && plc.device_roles.length > 0, "PLC fixture must retain device roles.");
assert(!plc.equipment_roles || plc.equipment_roles.length === 0, "PLC fixture must remain device-only.");
results.push("asset may carry device roles only");

const vfd = validateFixture(
  "equipment-and-device asset",
  "asset.json",
  "conformance/fixtures/v0.3/valid/asset-vfd-12.json"
);
assert(Array.isArray(vfd.equipment_roles) && vfd.equipment_roles.length > 0, "VFD fixture must retain equipment roles.");
assert(Array.isArray(vfd.device_roles) && vfd.device_roles.length > 0, "VFD fixture must retain device roles.");
results.push("asset may carry both equipment and device roles");

const unknown = validateFixture(
  "unclassified asset",
  "asset.json",
  "conformance/fixtures/v0.3/valid/asset-unclassified-logical.json"
);
assert(!unknown.equipment_roles, "Unclassified fixture must validate without equipment roles.");
assert(!unknown.device_roles, "Unclassified fixture must validate without device roles.");
results.push("asset may carry neither equipment nor device roles");

expectInvalid(
  "invalid role value",
  "asset.json",
  "conformance/fixtures/v0.3/invalid/asset-invalid-role.json",
  "must be equal to one of the allowed values"
);
results.push("invalid role values fail validation");

validateFixture(
  "legacy asset compatibility",
  "asset.json",
  "conformance/fixtures/v0.3/valid/asset-legacy-minimal.json"
);
results.push("legacy asset examples remain valid");

const smartPump = validateFixture(
  "classification provenance",
  "asset.json",
  "conformance/fixtures/v0.3/valid/asset-smart-pump-p201.json"
);
assert(Array.isArray(smartPump.classification_assertions) && smartPump.classification_assertions.length >= 4, "Smart pump fixture must preserve classification assertions.");
assert(smartPump.classification_assertions.some((entry) => entry.provenance), "Classification assertions must preserve provenance.");
results.push("classification provenance is retained");

assert(Array.isArray(vfd.lifecycle_roles) && vfd.lifecycle_roles.includes("cyber_managed_asset"), "Lifecycle roles must coexist with operational roles.");
results.push("lifecycle roles coexist with equipment and device roles");

validateFixture(
  "controls relationship",
  "relationship.json",
  "conformance/fixtures/v0.3/valid/relationship-controls-plc17-vfd12.json"
);
validateFixture(
  "measures relationship",
  "relationship.json",
  "conformance/fixtures/v0.3/valid/relationship-measures-pt101-pump-p101.json"
);
validateFixture(
  "actuates relationship",
  "relationship.json",
  "conformance/fixtures/v0.3/valid/relationship-actuates-vfd12-motor-m101.json"
);
validateFixture(
  "protects relationship",
  "relationship.json",
  "conformance/fixtures/v0.3/valid/relationship-protects-mpr101-motor-m101.json"
);
validateFixture(
  "drives relationship",
  "relationship.json",
  "conformance/fixtures/v0.3/valid/relationship-drives-motor-m101-pump-p101.json"
);
validateFixture(
  "communicates_with relationship",
  "relationship.json",
  "conformance/fixtures/v0.3/valid/relationship-communicates-with-gw01-plc17.json"
);
validateFixture(
  "is_part_of relationship",
  "relationship.json",
  "conformance/fixtures/v0.3/valid/relationship-is-part-of-pump-p101-cw01.json"
);
validateFixture(
  "is_installed_on relationship",
  "relationship.json",
  "conformance/fixtures/v0.3/valid/relationship-is-installed-on-pump-p101-unit14.json"
);
results.push("equipment and device interaction relationships validate correctly");

validateFixture(
  "observation reference",
  "observation.json",
  "conformance/fixtures/v0.3/valid/observation-pump-p101-discharge-pressure.json"
);
validateFixture(
  "condition reference",
  "condition.json",
  "conformance/fixtures/v0.3/valid/condition-pump-p101-cavitation-risk.json"
);
results.push("observation and condition references remain valid under v0.3 fixtures");

validateFixture(
  "robot cell composite asset",
  "asset.json",
  "conformance/fixtures/v0.3/valid/asset-robot-cell-rc01.json"
);
results.push("composite robot-cell asset examples validate under the overlapping role model");

const vibrationObservation = validateFixture(
  "truth-state observation",
  "observation.json",
  "conformance/fixtures/v0.4/valid/observation-pump-p201-vibration-rms.json"
);
assert(vibrationObservation.metric === "vibration_rms", "Truth-state observation fixture must preserve the vibration metric.");

const postActionObservation = validateFixture(
  "post-action observation",
  "observation.json",
  "conformance/fixtures/v0.4/valid/observation-pump-p201-vibration-post-inspection.json"
);
assert(postActionObservation.value < vibrationObservation.value, "Post-action observation must show reduced vibration.");

const sourceAssertion = validateFixture(
  "source assertion",
  "source-assertion.json",
  "conformance/fixtures/v0.4/valid/source-assertion-pump-p201-oem-vibration-advisory.json"
);
assert(sourceAssertion.evidence_refs.includes(vibrationObservation.record_id), "Source assertions must remain traceable to source evidence when provided.");

const contradictoryAssertion = validateFixture(
  "contradictory source assertion",
  "source-assertion.json",
  "conformance/fixtures/v0.4/valid/source-assertion-pump-p201-operator-normal-claim.json"
);
assert(
  contradictoryAssertion.subject_ref === sourceAssertion.subject_ref &&
    contradictoryAssertion.asserted_property === sourceAssertion.asserted_property &&
    contradictoryAssertion.asserted_value !== sourceAssertion.asserted_value,
  "Contradictory source assertions must be preservable for the same subject without forced reconciliation."
);

const derivedAssertion = validateFixture(
  "derived assertion",
  "derived-assertion.json",
  "conformance/fixtures/v0.4/valid/derived-assertion-pump-p201-vibration-trend.json"
);
assert(derivedAssertion.evidence_refs.includes(sourceAssertion.assertion_id), "Derived assertions must retain evidence references.");

const inference = validateFixture(
  "inference",
  "inference.json",
  "conformance/fixtures/v0.4/valid/inference-pump-p201-bearing-degradation.json"
);
assert(inference.evidence_refs.includes(derivedAssertion.assertion_id), "Inference must retain derived evidence references.");

const prediction = validateFixture(
  "prediction",
  "prediction.json",
  "conformance/fixtures/v0.4/valid/prediction-pump-p201-failure-risk-14d.json"
);
assert(prediction.evidence_refs.includes(inference.inference_id), "Prediction must retain evidence references.");

const recommendation = validateFixture(
  "recommendation",
  "recommendation.json",
  "conformance/fixtures/v0.4/valid/recommendation-pump-p201-inspection.json"
);
assert(recommendation.evidence_refs.includes(inference.inference_id), "Recommendation must remain traceable to inference evidence.");

const decision = validateFixture(
  "decision",
  "decision.json",
  "conformance/fixtures/v0.4/valid/decision-pump-p201-approve-inspection.json"
);
assert(decision.context_refs.includes(recommendation.recommendation_id), "Decision context must reference the recommendation chain.");

const action = validateFixture(
  "action",
  "action.json",
  "conformance/fixtures/v0.4/valid/action-pump-p201-inspection-completed.json"
);
assert(action.basis_refs.includes(decision.decision_id), "Action must retain decision context.");

const outcome = validateFixture(
  "outcome",
  "outcome.json",
  "conformance/fixtures/v0.4/valid/outcome-pump-p201-vibration-reduced.json"
);
assert(outcome.action_ref === action.action_id, "Outcome must reference the action context.");
assert(outcome.decision_ref === decision.decision_id, "Outcome must reference the decision context when available.");
assert(outcome.evidence_refs.includes(postActionObservation.record_id), "Outcome must retain evidence used for assessment.");
results.push("semantic truth-state fixtures validate from observation through outcome");

expectInvalid(
  "recommendation cannot masquerade as observation",
  "observation.json",
  "conformance/fixtures/v0.4/valid/recommendation-pump-p201-inspection.json",
  "must have required property"
);
results.push("recommendation cannot masquerade as an observation");

expectInvalid(
  "decision requires actor or authority",
  "decision.json",
  "conformance/fixtures/v0.4/invalid/decision-missing-actor-or-authority.json",
  "must match a schema in anyOf"
);
results.push("decision requires status and actor or governed authority");

expectInvalid(
  "outcome requires action or decision context",
  "outcome.json",
  "conformance/fixtures/v0.4/invalid/outcome-missing-context.json",
  "must match a schema in anyOf"
);
results.push("outcome must reference action or decision context");

expectInvalid(
  "derived assertion requires evidence references",
  "derived-assertion.json",
  "conformance/fixtures/v0.4/invalid/derived-assertion-missing-evidence.json",
  "must have required property 'evidence_refs'"
);
results.push("derived statements must retain evidence references");

const replacementBundle = validateIdentityBundle(
  "pump replacement identity lifecycle",
  "conformance/fixtures/v0.5/valid/identity-bundle-pump-replacement-same-tag.json"
);
ensureUniqueCanonicalIds(replacementBundle.assets);
ensureAssignmentValidity(replacementBundle.assets);
ensureNoOverlappingAssignments(replacementBundle.assets);
ensureSuccessionRelationships(replacementBundle.relationships);
results.push("replacement assets may retain the same engineering tag over time without reusing canonical identity");

const chillerBundle = validateIdentityBundle(
  "multi-source chiller identity convergence",
  "conformance/fixtures/v0.5/valid/identity-bundle-chiller-multi-source.json"
);
ensureUniqueCanonicalIds(chillerBundle.assets);
ensureAssignmentValidity(chillerBundle.assets);
ensureNoOverlappingAssignments(chillerBundle.assets);
results.push("an asset may hold multiple external identifiers across enterprise systems at the same time");

const plcBundle = validateIdentityBundle(
  "plc opc ua identity migration",
  "conformance/fixtures/v0.5/valid/identity-bundle-plc-opcua-migration.json"
);
ensureUniqueCanonicalIds(plcBundle.assets);
ensureAssignmentValidity(plcBundle.assets);
ensureNoOverlappingAssignments(plcBundle.assets);
results.push("OPC UA node identities may change over time without implying a new asset identity");

const acquisitionBundle = validateIdentityBundle(
  "duplicate engineering tags across different scopes",
  "conformance/fixtures/v0.5/valid/identity-bundle-acquired-plants-duplicate-tags.json"
);
ensureUniqueCanonicalIds(acquisitionBundle.assets);
ensureAssignmentValidity(acquisitionBundle.assets);
ensureNoOverlappingAssignments(acquisitionBundle.assets);
results.push("duplicate engineering tags may coexist across different scope rules");

const recommissionBundle = validateIdentityBundle(
  "asset decommission and recommission",
  "conformance/fixtures/v0.5/valid/identity-bundle-decommission-recommission.json"
);
ensureUniqueCanonicalIds(recommissionBundle.assets);
ensureAssignmentValidity(recommissionBundle.assets);
ensureNoOverlappingAssignments(recommissionBundle.assets);
ensureSuccessionRelationships(recommissionBundle.relationships);
results.push("an asset may be decommissioned and later recommissioned while preserving canonical identity");

const splitBundle = validateIdentityBundle(
  "asset split into successors",
  "conformance/fixtures/v0.5/valid/identity-bundle-asset-split.json"
);
ensureUniqueCanonicalIds(splitBundle.assets);
ensureAssignmentValidity(splitBundle.assets);
ensureNoOverlappingAssignments(splitBundle.assets);
ensureSuccessionRelationships(splitBundle.relationships);
results.push("asset split scenarios preserve predecessor and successor identity semantics");

const mergeBundle = validateIdentityBundle(
  "asset merge into managed operational asset",
  "conformance/fixtures/v0.5/valid/identity-bundle-asset-merge.json"
);
ensureUniqueCanonicalIds(mergeBundle.assets);
ensureAssignmentValidity(mergeBundle.assets);
ensureNoOverlappingAssignments(mergeBundle.assets);
ensureSuccessionRelationships(mergeBundle.relationships);
results.push("asset merge scenarios preserve managed-asset succession semantics");

expectInvalidIdentityBundle(
  "canonical ssom identifier reuse",
  "conformance/fixtures/v0.5/invalid/identity-bundle-duplicate-canonical-id.json",
  "must not be reused"
);
results.push("canonical SSOM asset identifiers cannot be reused");

expectInvalidIdentityBundle(
  "overlapping identifier assignments",
  "conformance/fixtures/v0.5/invalid/identity-bundle-overlapping-identifier-assignment.json",
  "overlaps across assets"
);
results.push("overlapping identifier assignments in the same scope and authority are rejected");

expectInvalidIdentityBundle(
  "self-referencing successor relationship",
  "conformance/fixtures/v0.5/invalid/identity-bundle-self-successor.json",
  "must not self-reference"
);
results.push("successor relationships cannot self-reference");

expectInvalidIdentityBundle(
  "malformed identifier validity period",
  "conformance/fixtures/v0.5/invalid/identity-bundle-invalid-identifier-validity.json",
  "invalid validity period"
);
results.push("identifier validity periods must be well formed and non-inverted");

const pressureObservation = validateMeasurementObservation(
  "pressure normalization measurement",
  "conformance/fixtures/v0.6/valid/observation-pressure-bar-normalized.json"
);
assert(pressureObservation.canonical_measurement.canonical_unit.unit_code === "KPA", "Pressure canonical unit must be explicit.");

const temperatureObservation = validateMeasurementObservation(
  "temperature normalization measurement",
  "conformance/fixtures/v0.6/valid/observation-temperature-fahrenheit-normalized.json"
);
assert(temperatureObservation.canonical_measurement.quantity_kind === "temperature", "Temperature observation must declare quantity kind.");

const vibrationObservationAccel = validateMeasurementObservation(
  "vibration acceleration normalization",
  "conformance/fixtures/v0.6/valid/observation-vibration-g-normalized.json"
);
assert(vibrationObservationAccel.canonical_measurement.quantity_kind === "vibration_acceleration", "Vibration acceleration must remain explicit.");

const flowObservation = validateMeasurementObservation(
  "flow normalization measurement",
  "conformance/fixtures/v0.6/valid/observation-flow-gpm-normalized.json"
);
assert(flowObservation.canonical_measurement.canonical_unit.unit_code === "L_PER_S", "Flow canonical unit must be explicit.");

const valvePercentObservation = validateMeasurementObservation(
  "valve percent open signal",
  "conformance/fixtures/v0.6/valid/observation-valve-position-percent-open.json"
);
const valveTravelObservation = validateMeasurementObservation(
  "valve travel signal",
  "conformance/fixtures/v0.6/valid/observation-valve-travel-millimeters.json"
);
assert(
  valvePercentObservation.canonical_measurement.quantity_kind !== valveTravelObservation.canonical_measurement.quantity_kind,
  "Percent open and millimeters of travel must remain different quantity kinds unless explicitly mapped."
);

const stalePressureObservation = validateMeasurementObservation(
  "stale degraded pressure measurement",
  "conformance/fixtures/v0.6/valid/observation-pressure-stale-degraded.json"
);
assert(stalePressureObservation.measurement_quality.stale_data_state === "stale", "Stale measurement must preserve stale-data status.");
assert(stalePressureObservation.measurement_quality.communication_quality === "degraded", "Stale measurement must preserve degraded communication quality.");

const overdueCalibrationObservation = validateMeasurementObservation(
  "overdue calibration measurement",
  "conformance/fixtures/v0.6/valid/observation-pressure-overdue-calibration.json"
);
assert(overdueCalibrationObservation.calibration_context.next_due_status === "overdue", "Calibration context must preserve overdue status.");

const lateArrivalObservation = validateMeasurementObservation(
  "late arriving historian measurement",
  "conformance/fixtures/v0.6/valid/observation-pressure-late-arrival.json"
);
assert(lateArrivalObservation.time_synchronization_context.ordering_state === "late_arrival", "Late-arriving data must preserve ordering state.");
assert(lateArrivalObservation.temporal_integrity.delivery_classification === "late_arrival", "Late-arriving data must preserve temporal delivery classification.");
const lateArrivalCondition = validateFixture(
  "late-arrival condition reinterpretation",
  "condition.json",
  "conformance/fixtures/v0.6/valid/condition-p101-cavitation-risk-revised-late-data.json"
);
assert(lateArrivalCondition.evidence_refs.includes(lateArrivalObservation.record_id), "Late-arriving condition reinterpretation must retain late-data evidence refs.");
results.push("structured measurement semantics preserve source, canonical, quality, calibration, signal, and timing context");

expectInvalidMeasurementObservation(
  "incompatible quantity kind conversion",
  "conformance/fixtures/v0.6/invalid/observation-incompatible-quantity-kind.json",
  "incompatible quantity kinds"
);
results.push("incompatible quantity kinds cannot be silently converted");

expectInvalidMeasurementObservation(
  "incompatible canonical units",
  "conformance/fixtures/v0.6/invalid/observation-incompatible-unit-conversion.json",
  "incompatible units"
);
results.push("incompatible units are rejected or flagged");

expectInvalid(
  "canonical measurement requires quantity kind",
  "observation.json",
  "conformance/fixtures/v0.6/invalid/observation-missing-canonical-quantity-kind.json",
  "must have required property 'quantity_kind'"
);
results.push("canonical measurement cannot omit quantity kind");

expectInvalid(
  "conversion lineage requires source unit",
  "observation.json",
  "conformance/fixtures/v0.6/invalid/observation-missing-conversion-source-unit.json",
  "must have required property 'source_unit'"
);
results.push("canonical conversion cannot omit source-unit lineage");

expectInvalidMeasurementObservation(
  "free-form calibration note without structure",
  "conformance/fixtures/v0.6/invalid/observation-freeform-calibration-note.json",
  "free-form calibration note"
);
results.push("calibration status cannot be represented only as a free-form note");

const motorBundle = validateReliabilityBundle(
  "motor bearing degradation work chain",
  "conformance/fixtures/v0.7/valid/reliability-bundle-motor-bearing-degradation.json"
);
ensureReliabilityReferences(motorBundle, "motor bearing degradation work chain");
assert(motorBundle.work_outcomes[0].outcome_disposition === "positive", "Motor bearing outcome must be positive.");
assert(motorBundle.work_outcomes[0].reliability_impact.direction === "improved", "Motor bearing outcome must preserve reliability improvement.");
results.push("motor-bearing degradation can be traced from observation through diagnostic, work verification, and positive outcome");

const pumpSealBundle = validateReliabilityBundle(
  "pump seal ineffective repair",
  "conformance/fixtures/v0.7/valid/reliability-bundle-pump-seal-unresolved.json"
);
ensureReliabilityReferences(pumpSealBundle, "pump seal ineffective repair");
assert(pumpSealBundle.work_outcomes[0].outcome_disposition === "ineffective", "Pump seal scenario must record an ineffective outcome.");
assert(pumpSealBundle.work_outcomes[0].recurrence_context.recurrence_status === "open", "Pump seal recurrence must remain open.");
results.push("completed work may still produce ineffective or unresolved reliability outcomes");

const vfdBundle = validateReliabilityBundle(
  "vfd replacement restoration",
  "conformance/fixtures/v0.7/valid/reliability-bundle-vfd-replacement-restoration.json"
);
ensureReliabilityReferences(vfdBundle, "vfd replacement restoration");
assert(vfdBundle.work_outcomes[0].operational_impact.direction === "improved", "VFD replacement must preserve production or operational improvement.");
results.push("replacement work can preserve mechanism, configuration restoration, verification, and production impact reduction");

const safetyBundle = validateReliabilityBundle(
  "safety proof test evidence",
  "conformance/fixtures/v0.7/valid/reliability-bundle-safety-proof-test.json"
);
ensureReliabilityReferences(safetyBundle, "safety proof test evidence");
assert(safetyBundle.work_outcomes[0].outcome_disposition === "inconclusive", "Safety proof-test bundle must avoid overclaiming compliance as a positive outcome.");
assert(!safetyBundle.work_outcomes[0].extensions?.functional_safety_compliance_claim, "Safety proof-test bundle must not make a false compliance claim.");
results.push("safety-related maintenance may preserve verification evidence without claiming functional-safety compliance");

const noActionBundle = validateReliabilityBundle(
  "recommendation and decision without action",
  "conformance/fixtures/v0.7/valid/reliability-bundle-recommendation-decision-no-action.json"
);
ensureReliabilityReferences(noActionBundle, "recommendation and decision without action");
assert((noActionBundle.work_executions || []).length === 0, "Recommendation to decision flow must not require action.");
results.push("a recommendation can lead to a decision without necessarily leading to action");

const neutralBundle = validateReliabilityBundle(
  "neutral completed action outcome",
  "conformance/fixtures/v0.7/valid/reliability-bundle-neutral-outcome.json"
);
ensureReliabilityReferences(neutralBundle, "neutral completed action outcome");
assert(neutralBundle.work_outcomes[0].outcome_disposition === "neutral", "Neutral outcome bundle must preserve a neutral disposition.");
const outcomeClasses = [
  motorBundle.work_outcomes[0].outcome_disposition,
  pumpSealBundle.work_outcomes[0].outcome_disposition,
  safetyBundle.work_outcomes[0].outcome_disposition,
  neutralBundle.work_outcomes[0].outcome_disposition
];
assert(outcomeClasses.includes("positive"), "Positive outcome disposition must be supported.");
assert(outcomeClasses.includes("neutral"), "Neutral outcome disposition must be supported.");
assert(outcomeClasses.includes("inconclusive"), "Inconclusive outcome disposition must be supported.");
assert(outcomeClasses.some((entry) => entry === "negative" || entry === "ineffective"), "Negative or ineffective outcome disposition must be supported.");
results.push("completed action may have neutral, negative or ineffective, inconclusive, or positive outcome dispositions");

expectInvalidReliabilityBundle(
  "verified outcome without verification evidence",
  "conformance/fixtures/v0.7/invalid/reliability-bundle-missing-verification-link.json",
  "must reference work verification evidence"
);
results.push("work execution cannot be represented as verified outcome without verification evidence");

expectInvalidReliabilityBundle(
  "work outcome missing observed outcome",
  "conformance/fixtures/v0.7/invalid/reliability-bundle-work-outcome-missing-observed.json",
  "must have required property 'observed_outcome'"
);
results.push("work outcome must distinguish intended outcome from observed outcome");

expectInvalidReliabilityBundle(
  "collapsed failure semantics into free text",
  "conformance/fixtures/v0.7/invalid/reliability-bundle-diagnostic-freeform-collapse.json",
  "must match a schema in anyOf"
);
results.push("failure mode, mechanism, and cause cannot be collapsed into one uncontrolled text field when structured references are available");

const vfdEventAlarmBundle = validateEventAlarmBundle(
  "vfd fault event and alarm recommendation chain",
  "conformance/fixtures/v0.8/valid/event-alarm-bundle-vfd-fault-recommendation.json"
);
ensureEventAlarmSemantics(vfdEventAlarmBundle, "vfd fault event and alarm recommendation chain");
assert(vfdEventAlarmBundle.alarms[0].event_ref === vfdEventAlarmBundle.events[0].event_id, "VFD alarm must be linked to the VFD fault event.");
assert(vfdEventAlarmBundle.recommendations[0].evidence_refs.includes(vfdEventAlarmBundle.alarms[0].alarm_id), "VFD recommendation must preserve alarm evidence.");
results.push("fault events may lead to governed alarms and downstream recommendations without collapsing those semantics");

const commsLossBundle = validateEventAlarmBundle(
  "pt communication loss event without alarm",
  "conformance/fixtures/v0.8/valid/event-alarm-bundle-pt-communication-loss.json"
);
ensureEventAlarmSemantics(commsLossBundle, "pt communication loss event without alarm");
assert((commsLossBundle.alarms || []).length === 0, "Communication-loss event scenario must remain event-only when no governed alarm exists.");
results.push("communication-loss events can be represented without implicitly creating an alarm");

const highTempBundle = validateEventAlarmBundle(
  "high temperature threshold alarm",
  "conformance/fixtures/v0.8/valid/event-alarm-bundle-high-temperature-threshold.json"
);
ensureEventAlarmSemantics(highTempBundle, "high temperature threshold alarm");
assert(highTempBundle.alarms[0].derivation_type === "observation_threshold_breach", "High-temperature alarm must preserve threshold-breach derivation.");
results.push("threshold-breach alarms preserve the triggering observation, threshold, and canonical alarm state");

const maintenanceSuppressionBundle = validateEventAlarmBundle(
  "alarm suppression during maintenance",
  "conformance/fixtures/v0.8/valid/event-alarm-bundle-maintenance-suppression.json"
);
ensureEventAlarmSemantics(maintenanceSuppressionBundle, "alarm suppression during maintenance");
assert(maintenanceSuppressionBundle.alarms[0].alarm_state === "suppressed", "Maintenance suppression scenario must end in suppressed state.");
results.push("alarm suppression during maintenance retains provenance, valid period, and explicit work context");

const safetyBypassBundle = validateEventAlarmBundle(
  "safety bypass activation with work context",
  "conformance/fixtures/v0.8/valid/event-alarm-bundle-safety-bypass-activation.json"
);
ensureEventAlarmSemantics(safetyBypassBundle, "safety bypass activation with work context");
assert(safetyBypassBundle.events[0].event_category === "safety", "Safety bypass scenario must remain a safety event.");
results.push("safety bypass activation events preserve state transition evidence and linked work context");

const lateArrivalBundle = validateEventAlarmBundle(
  "late arriving historian event with prior evidence",
  "conformance/fixtures/v0.8/valid/event-alarm-bundle-late-arriving-historian-event.json"
);
ensureEventAlarmSemantics(lateArrivalBundle, "late arriving historian event with prior evidence");
assert(lateArrivalBundle.events[0].temporal_integrity.delivery_classification === "late_arrival", "Late historian scenario must preserve late-arrival classification.");
results.push("late-arriving historian events preserve event time, receive time, and prior evidence references");

const falseAlarmBundle = validateEventAlarmBundle(
  "false alarm linked to instrument drift and verification",
  "conformance/fixtures/v0.8/valid/event-alarm-bundle-false-alarm-instrument-drift.json"
);
ensureEventAlarmSemantics(falseAlarmBundle, "false alarm linked to instrument drift and verification");
assert(falseAlarmBundle.alarms[0].alarm_state === "cleared", "False alarm scenario must end with a cleared alarm state.");
assert(falseAlarmBundle.work_verifications[0].verification_status === "verified", "False alarm scenario must preserve later verification evidence.");
results.push("false alarms can be linked to instrument drift and later verification without erasing the original alarm evidence");

expectInvalidEventAlarmBundle(
  "alarm semantics collapsed into condition free text",
  "conformance/fixtures/v0.8/invalid/event-alarm-bundle-condition-freeform-alarm.json",
  "must not be represented solely as uncontrolled string content in Condition"
);
results.push("alarm semantics cannot be represented solely as uncontrolled string content in Condition");

expectInvalidEventAlarmBundle(
  "alarm semantics collapsed into observation free text",
  "conformance/fixtures/v0.8/invalid/event-alarm-bundle-observation-freeform-alarm.json",
  "must not be represented solely as uncontrolled string content in Observation"
);
results.push("alarm semantics cannot be represented solely as uncontrolled string content in Observation");

expectInvalidEventAlarmBundle(
  "invalid alarm lifecycle transition chain",
  "conformance/fixtures/v0.8/invalid/event-alarm-bundle-invalid-transition.json",
  "final transition state must match the canonical alarm state"
);
results.push("alarm lifecycle transition chains must remain state-consistent and time-ordered");

expectInvalidEventAlarmBundle(
  "suppression without valid interval",
  "conformance/fixtures/v0.8/invalid/event-alarm-bundle-suppression-missing-validity.json",
  "must retain a valid-from timestamp"
);
results.push("suppression and shelving require provenance and an explicit valid interval");

const coolingWaterBundle = validateRelationshipBundle(
  "cooling water system relationship bundle",
  "conformance/fixtures/v0.9/valid/relationship-bundle-cooling-water-system.json"
);
ensureRelationshipSemantics(coolingWaterBundle, "cooling water system relationship bundle");
results.push("cooling-water systems can distinguish operational boundaries, functional locations, asset classes, equipment models, and constituent assets");

const driveTrainBundle = validateRelationshipBundle(
  "motor pump drive train relationship bundle",
  "conformance/fixtures/v0.9/valid/relationship-bundle-motor-pump-drive-train.json"
);
ensureRelationshipSemantics(driveTrainBundle, "motor pump drive train relationship bundle");
results.push("drive, power, control, and monitoring relationships remain directionally governed across mixed asset and control entities");

const robotCellBundle = validateRelationshipBundle(
  "robot cell relationship bundle",
  "conformance/fixtures/v0.9/valid/relationship-bundle-robot-cell-line-context.json"
);
ensureRelationshipSemantics(robotCellBundle, "robot cell relationship bundle");
results.push("robot cells can be modeled as composite operational boundaries with constituent controllers, sensors, HMI, and line context");

const processSegmentBundle = validateRelationshipBundle(
  "process segment upstream downstream bundle",
  "conformance/fixtures/v0.9/valid/relationship-bundle-process-segment-upstream-downstream.json"
);
ensureRelationshipSemantics(processSegmentBundle, "process segment upstream downstream bundle");
results.push("process segments remain distinct from asset instances while supporting upstream and downstream relationship semantics");

const extensionBundle = validateRelationshipBundle(
  "source extension relationship bundle",
  "conformance/fixtures/v0.9/valid/relationship-bundle-source-extension-mapping.json"
);
ensureRelationshipSemantics(extensionBundle, "source extension relationship bundle");
results.push("source-specific relationships can be preserved as namespaced mappings without collapsing into unrestricted core free text");

expectInvalidRelationshipBundle(
  "unsupported subject object relationship domain",
  "conformance/fixtures/v0.9/invalid/relationship-bundle-unsupported-domain.json",
  "uses unsupported subject/object domain"
);
results.push("core relationships reject unsupported subject and object domain combinations");

expectInvalidRelationshipBundle(
  "contradictory inverse relationship usage",
  "conformance/fixtures/v0.9/invalid/relationship-bundle-contradictory-inverse.json",
  "must use a known inverse pair"
);
results.push("reverse relationships must use governed inverse pairs rather than contradictory duplicate directionality");

expectInvalidRelationshipBundle(
  "unrestricted free text relationship type",
  "conformance/fixtures/v0.9/invalid/relationship-bundle-free-text-core-use.json",
  "must match a schema in anyOf"
);
results.push("core relationship types cannot degrade into unrestricted free text");

expectInvalidRelationshipBundle(
  "extension relationship missing namespace stewardship",
  "conformance/fixtures/v0.9/invalid/relationship-bundle-extension-missing-namespace.json",
  "must declare an extension namespace"
);
results.push("extension relationships must retain namespace and mapping stewardship metadata");

expectInvalidRelationshipBundle(
  "invalid relationship temporal validity",
  "conformance/fixtures/v0.9/invalid/relationship-bundle-invalid-temporal-validity.json",
  "has an invalid validity period"
);
results.push("time-bounded relationships must preserve valid temporal intervals");

console.log("SSOM schema validation passed:");
for (const result of results) {
  console.log(`- ${result}`);
}