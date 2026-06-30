# BigQuery Non-Production Validation Plan v1.0

## Objective

Validate the SSOM BigQuery reference architecture in a reproducible, non-production environment using parameterized queries and captured runtime evidence.

## Preconditions

- a non-production Google Cloud project;
- non-production BigQuery datasets populated from synthetic, masked, or otherwise safe test data;
- no production secrets, production workflow endpoints, or production tenant payloads; and
- repository revision pinned before the run begins.

## Required evidence capture

Capture the following from each run:

- repository commit hash;
- target project and dataset names;
- query job IDs;
- query text revision or file hash;
- row counts before and after rebuild checks;
- projection exclusion evidence;
- comparability exclusion evidence;
- outcome-feedback lineage evidence; and
- actual runtime metrics observed in the environment.

## Validation sequence

1. Confirm raw, canonical, curated, serving, and AI benchmark datasets exist only in non-production locations.
2. Run lineage and rebuildability checks to prove serving or AI outputs can be recreated from canonical history.
3. Run projection-boundary checks to prove raw historian samples, high-frequency telemetry, and raw OPC UA payloads are not projected into workflow-facing tables.
4. Run comparability checks to prove ineligible cross-site evidence is excluded from benchmark inputs.
5. Run outcome-feedback checks to prove recommendation, execution, verification, and updated-context lineage remains reconstructable.
6. Record actual runtime results in the capture template.

## Claim discipline

This plan does not claim any benchmark, latency, throughput, or cost result by itself. Those values must come only from actual non-production execution evidence captured during a run.