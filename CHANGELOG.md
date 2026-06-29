# Changelog

## v0.3.0 - 2026-06-29

### Added: Asset Equipment and Device Role Classification

- Asset is now explicitly defined as the canonical lifecycle identity for industrial entities across lifecycle, provenance, relationships, condition, work, and outcomes.
- Equipment and Device are now explicitly defined as distinct, overlapping operational classifications of Asset rather than mutually exclusive top-level types.
- The update is additive and backward-compatible with the v0.2 draft because the new schema fields are optional and existing Asset payloads remain valid.
- New governed vocabularies were added for asset forms, equipment roles, device roles, and lifecycle roles.
- New classification assertions preserve provenance, effective period, confidence, source-specific type retention, and derivation traceability.
- New examples, migration guidance, standards mapping notes, ServiceNow coexistence guidance, and conformance fixtures were added.
- Existing implementations should not infer that Equipment and Device are mutually exclusive.