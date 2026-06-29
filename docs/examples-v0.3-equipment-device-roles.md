# SSOM v0.3 Examples: Equipment and Device Roles

This document points to the normative JSON Schema fixtures that demonstrate SSOM v0.3.0 asset classification behavior.

## Asset examples

- Pump `P-101` as Equipment Asset: [conformance/fixtures/v0.3/valid/asset-pump-p101.json](../conformance/fixtures/v0.3/valid/asset-pump-p101.json)
- PLC-17 as Device Asset: [conformance/fixtures/v0.3/valid/asset-plc-17.json](../conformance/fixtures/v0.3/valid/asset-plc-17.json)
- VFD-12 as both Equipment and Device: [conformance/fixtures/v0.3/valid/asset-vfd-12.json](../conformance/fixtures/v0.3/valid/asset-vfd-12.json)
- Smart Pump P-201 as both Equipment and Device: [conformance/fixtures/v0.3/valid/asset-smart-pump-p201.json](../conformance/fixtures/v0.3/valid/asset-smart-pump-p201.json)
- Robot Cell RC-01 as a composite operational asset: [conformance/fixtures/v0.3/valid/asset-robot-cell-rc01.json](../conformance/fixtures/v0.3/valid/asset-robot-cell-rc01.json)

## Relationship examples

- Pressure transmitter measures pump discharge pressure: [conformance/fixtures/v0.3/valid/relationship-measures-pt101-pump-p101.json](../conformance/fixtures/v0.3/valid/relationship-measures-pt101-pump-p101.json)
- PLC controls VFD: [conformance/fixtures/v0.3/valid/relationship-controls-plc17-vfd12.json](../conformance/fixtures/v0.3/valid/relationship-controls-plc17-vfd12.json)
- VFD actuates motor: [conformance/fixtures/v0.3/valid/relationship-actuates-vfd12-motor-m101.json](../conformance/fixtures/v0.3/valid/relationship-actuates-vfd12-motor-m101.json)
- Motor drives pump: [conformance/fixtures/v0.3/valid/relationship-drives-motor-m101-pump-p101.json](../conformance/fixtures/v0.3/valid/relationship-drives-motor-m101-pump-p101.json)
- Protection relay protects motor: [conformance/fixtures/v0.3/valid/relationship-protects-mpr101-motor-m101.json](../conformance/fixtures/v0.3/valid/relationship-protects-mpr101-motor-m101.json)
- Gateway communicates with PLC: [conformance/fixtures/v0.3/valid/relationship-communicates-with-gw01-plc17.json](../conformance/fixtures/v0.3/valid/relationship-communicates-with-gw01-plc17.json)
- Pump is part of cooling-water system: [conformance/fixtures/v0.3/valid/relationship-is-part-of-pump-p101-cw01.json](../conformance/fixtures/v0.3/valid/relationship-is-part-of-pump-p101-cw01.json)
- Pump is installed on functional location: [conformance/fixtures/v0.3/valid/relationship-is-installed-on-pump-p101-unit14.json](../conformance/fixtures/v0.3/valid/relationship-is-installed-on-pump-p101-unit14.json)

## Example interpretation notes

- `P-101` shows a conventional equipment-centric asset with lifecycle roles and linked observation and condition evidence.
- `PLC-17` shows a device-centric asset with firmware, protocol, network, and diagnostic context.
- `VFD-12` proves that SSOM does not force a false mutually exclusive choice between Equipment and Device.
- `Smart Pump P-201` shows how embedded sensing, diagnostics, and control interfaces can coexist with a process-equipment role.
- `Robot Cell RC-01` should be modeled as a `system` when the concern is functional composition, production context, or contained assets. It may be modeled as a serialized Asset when the cell itself is commissioned, maintained, monitored, or governed as a managed operational entity.