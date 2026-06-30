# SSOM ServiceNow Serving Projection Profile v0.9

## Purpose

This profile defines a deliberately bounded serving projection for workflow and system-of-action platforms such as ServiceNow.

SSOM remains the canonical semantic and evidence layer. ServiceNow remains a workflow and system-of-action consumer. This profile defines what a curated projection may send without converting SSOM into a ServiceNow schema or turning ServiceNow into the canonical industrial evidence store.

## Curated projection fields

Where available, a serving projection should include:

- canonical SSOM Asset ID;
- mapped ServiceNow CI ID;
- mapped Equipment Model or operational hierarchy reference;
- current operational state;
- current condition score;
- risk score;
- criticality;
- active anomalies;
- relevant event and alarm summary;
- evidence freshness;
- related failure modes;
- recommended action;
- recommendation confidence;
- work recommendation;
- related assets;
- operational or production impact;
- ServiceNow task, incident, change, or work references;
- link or reference to the full SSOM evidence context.

## What must not be projected as primary ServiceNow storage

- raw historian samples;
- high-frequency telemetry;
- raw OPC UA payloads;
- all source assertions;
- all machine-learning feature records;
- all raw event transitions;
- all data-quality records;
- all analytical cohort data.

## Profile rules

- The projection is curated, typed, and rebuildable.
- The projection may reference full SSOM evidence context, but it does not replace it.
- The projection should favor current-state and workflow-relevant summaries over raw evidence density.
- ServiceNow-specific identifiers remain mapped external references rather than canonical SSOM identity.
- The profile may support task, incident, change, or work references, but those workflow records do not redefine SSOM semantics.

## Fixtures and validation

- Schema: `schemas/jsonschema/servicenow-serving-projection-bundle.json`
- Fixture: `conformance/fixtures/v0.9/valid/servicenow-serving-projection-bundle-core-assets.json`
- Covered scenarios: pump, PLC, VFD, chiller, and robot-cell projections.

## Boundary statement

This profile defines a ServiceNow-facing serving surface only. It does not claim a one-to-one mapping to CMDB class hierarchies, CSDM completeness, or a generic ServiceNow product adapter.