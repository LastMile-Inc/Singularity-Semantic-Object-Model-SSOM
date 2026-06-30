# Reference Validation Package

This package defines reproducible, non-production validation guidance for the SSOM BigQuery reference architecture and adjacent serving or AI proof surfaces.

## Scope

- non-production only;
- parameterized and reproducible query execution;
- evidence capture for rebuildability, lineage, serving-boundary, and comparability checks; and
- explicit separation between static repository validation and runtime environment validation.

## Rules

- Do not use production datasets, production credentials, or production workflow endpoints.
- Do not invent performance, latency, throughput, storage, or cost numbers in documentation or release claims.
- Record actual measurements only after executing the non-production plan in a real environment.
- Treat this package as implementation-validation guidance, not as an extension of SSOM Core semantics.

## Contents

- `reference-validation/bigquery/nonproduction-validation-plan-v1.0.md`
- `reference-validation/bigquery/nonprod-validation-queries.sql`
- `reference-validation/bigquery/reproducibility-checklist-v1.0.md`
- `reference-validation/bigquery/runtime-capture-template-v1.0.md`

## Intended outcome

An implementation team can execute the reference BigQuery validation plan against a non-production environment, capture real evidence, and decide whether the repository's reference architecture assumptions hold without overstating any performance or compliance claim.