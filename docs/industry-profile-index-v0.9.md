# SSOM Industry Profile Index v0.9

These industry profiles are bounded scaffolds for early implementers and external reviewers. They demonstrate how SSOM can be specialized by industry without moving vertical-specific vocabulary into the SSOM core.

## Process manufacturing

- Scope: process trains, rotating equipment, valves, analyzers, SIS-linked context, and recurrence-aware maintenance.
- Fixture: `conformance/fixtures/v0.9/valid/industry-profile-process-manufacturing.json`
- Example emphasis: pump lifecycle, safety bypass visibility, and workflow projection.

## Discrete manufacturing

- Scope: robot cells, conveyors, PLCs, HMIs, drives, and line-control context.
- Fixture: `conformance/fixtures/v0.9/valid/industry-profile-discrete-manufacturing.json`
- Example emphasis: drive fault, cell topology, cyber-managed VFD context, and workflow projection.

## Utilities and electric power

- Scope: substations, breakers, relays, transformers, control cabinets, utility topology, and protection context.
- Fixture: `conformance/fixtures/v0.9/valid/industry-profile-utilities-electric-power.json`
- Example emphasis: topology, protection event context, cyber zone or conduit context, and restoration workflow implications.

## Water and wastewater

- Scope: pump stations, treatment boundaries, SCADA-linked instrumentation, and reliability-work context.
- Fixture: `conformance/fixtures/v0.9/valid/industry-profile-water-wastewater.json`
- Example emphasis: pump degradation, boundary-aware operations, and workflow projection without raw telemetry collapse.

## Facilities and data centers

- Scope: chillers, gateways, environmental signals, utility-support assets, and multi-source identity continuity.
- Fixture: `conformance/fixtures/v0.9/valid/industry-profile-facilities-data-centers.json`
- Example emphasis: chiller identity convergence, environmental signal normalization, and ServiceNow-facing projection.

## Profile boundary

- These profiles define bounded applicability, not vertical-specific core ontology expansion.
- Each profile names exclusions explicitly so external reviewers can separate current scope from future roadmap items.
- Safety and cyber implications remain qualified through the bounded foundation profiles rather than broad compliance claims.