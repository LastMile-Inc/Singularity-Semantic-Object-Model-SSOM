# SSOM v0.9 Migration Guidance

## What changed

SSOM v0.9 adds governed relationship semantics and explicit non-serialized operational boundary objects. This update is additive and backward-compatible with v0.8 because prior records remain valid, but implementations claiming v0.9 relationship conformance must stop using unrestricted free-text core relationship types.

## Migration rules

- Keep Asset as the canonical lifecycle identity for serialized or managed entities.
- Use `asset-class.json` for taxonomy concepts and `equipment-model.json` for manufacturer or design models rather than treating either as serialized assets.
- Use `operational-boundary.json` for systems, subsystems, functional systems, process segments, production units, and control entities when those are contextual boundaries rather than commissioned assets.
- Use `functional-location.json` for placement and continuity context; do not collapse functional location into Asset identity.
- Use governed core relationship codes for core semantics.
- Preserve source-specific relationship names through namespaced extension relationship codes plus mapping metadata when no approved core term exists.
- Treat detailed ISA-95 style hierarchy expansion as profile work rather than forcing a complete hierarchy into the core model.

## Practical mapping guidance

- Replace free-text relationship fields such as `mountedInside`, `owns`, or `attachedTo` with either a governed core relationship or a namespaced extension relationship plus mapping metadata.
- Normalize legacy aliases such as `is_installed_on`, `powered_by`, `replaced_by`, and `preceded_by` through the governed registry rather than introducing more synonymous codes.
- Model robot cells, cooling-water systems, and process segments as operational boundaries by default unless the organization explicitly manages the aggregate as a serialized asset in its own right.

## BigQuery reference implementation migration note

The illustrative `ssom_core.assets` style SQL examples are now superseded by the layered BigQuery reference architecture under `reference-implementation/bigquery/`.

Migration guidance for existing illustrative deployments:

- Move raw payload and source event landing tables into the `ssom_raw_evidence` dataset.
- Move typed semantic history into the `ssom_canonical` dataset.
- Rebuild derived cohorts and operational metrics into `ssom_curated_oi`.
- Keep workflow and product-serving projections in `ssom_serving` rather than treating them as canonical fact tables.
- Keep feature tables, retrieval views, labels, and evaluation sets in `ssom_ai`.
- Replace JSON-first filters on high-frequency telemetry with typed columns such as `measurement_type`, `event_time`, `canonical_asset_id`, `tenant_id`, `site_id`, `quality_state`, and `canonical_unit_code`.
- Preserve late-arriving, corrected, and superseded facts through append-preserving lineage fields rather than destructive updates.

## Serving, safety, and cyber profile migration note

- Replace informal or ad hoc ServiceNow payload exports with the bounded serving projection described in `docs/servicenow-serving-projection-profile-v0.9.md`.
- Keep raw historian, OPC UA, and analytic cohort detail out of workflow-primary storage surfaces.
- Use the functional safety foundation profile only for safety context, traceability, bypass visibility, and proof-test evidence boundaries.
- Use the OT cybersecurity foundation profile only for foundational identity, topology, vulnerability, posture, and mitigation context.
- Do not infer complete safety or cybersecurity management behavior from these profiles alone.

## Industry-profile migration note

- Use the industry profiles as bounded scaffolds for vertical adaptation rather than as permission to push all sector-specific vocabulary into SSOM core.
- Keep vertical-specific vocabulary, measurements, exclusions, and workflow implications inside the relevant profile or extension package.
- Treat the industry-profile fixtures as candidate-spec review examples, not as exhaustive sector reference models.