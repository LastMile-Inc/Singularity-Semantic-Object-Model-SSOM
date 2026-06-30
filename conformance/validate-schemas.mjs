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

const results = [];

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

console.log("SSOM schema validation passed:");
for (const result of results) {
  console.log(`- ${result}`);
}