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

console.log("SSOM schema validation passed:");
for (const result of results) {
  console.log(`- ${result}`);
}