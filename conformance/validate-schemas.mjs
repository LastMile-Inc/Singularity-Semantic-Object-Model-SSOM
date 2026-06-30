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

console.log("SSOM schema validation passed:");
for (const result of results) {
  console.log(`- ${result}`);
}