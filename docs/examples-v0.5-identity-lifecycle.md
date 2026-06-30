# SSOM v0.5 Examples: Asset Identity Lifecycle and Succession

This document points to the normative fixture bundles that demonstrate SSOM v0.5.0 identity continuity behavior.

## Identity lifecycle scenarios

1. Pump replacement at the same functional location while retaining the same engineering tag: [conformance/fixtures/v0.5/valid/identity-bundle-pump-replacement-same-tag.json](../conformance/fixtures/v0.5/valid/identity-bundle-pump-replacement-same-tag.json)
2. Chiller identity convergence across BMS, SCADA, CMMS, ServiceNow, OEM cloud, EAM, and manufacturer systems: [conformance/fixtures/v0.5/valid/identity-bundle-chiller-multi-source.json](../conformance/fixtures/v0.5/valid/identity-bundle-chiller-multi-source.json)
3. PLC OPC UA node identity change after upgrade: [conformance/fixtures/v0.5/valid/identity-bundle-plc-opcua-migration.json](../conformance/fixtures/v0.5/valid/identity-bundle-plc-opcua-migration.json)
4. Duplicate engineering tags across acquired plants under different scope rules: [conformance/fixtures/v0.5/valid/identity-bundle-acquired-plants-duplicate-tags.json](../conformance/fixtures/v0.5/valid/identity-bundle-acquired-plants-duplicate-tags.json)
5. Asset decommissioned and later recommissioned: [conformance/fixtures/v0.5/valid/identity-bundle-decommission-recommission.json](../conformance/fixtures/v0.5/valid/identity-bundle-decommission-recommission.json)
6. Asset split into two successors: [conformance/fixtures/v0.5/valid/identity-bundle-asset-split.json](../conformance/fixtures/v0.5/valid/identity-bundle-asset-split.json)
7. Two assets merged into one managed operational asset: [conformance/fixtures/v0.5/valid/identity-bundle-asset-merge.json](../conformance/fixtures/v0.5/valid/identity-bundle-asset-merge.json)

## Invalid scenarios

- Canonical SSOM ID reuse: [conformance/fixtures/v0.5/invalid/identity-bundle-duplicate-canonical-id.json](../conformance/fixtures/v0.5/invalid/identity-bundle-duplicate-canonical-id.json)
- Overlapping identifier assignments in the same scope and authority: [conformance/fixtures/v0.5/invalid/identity-bundle-overlapping-identifier-assignment.json](../conformance/fixtures/v0.5/invalid/identity-bundle-overlapping-identifier-assignment.json)
- Self-referencing successor relationship: [conformance/fixtures/v0.5/invalid/identity-bundle-self-successor.json](../conformance/fixtures/v0.5/invalid/identity-bundle-self-successor.json)
- Malformed identifier validity period: [conformance/fixtures/v0.5/invalid/identity-bundle-invalid-identifier-validity.json](../conformance/fixtures/v0.5/invalid/identity-bundle-invalid-identifier-validity.json)