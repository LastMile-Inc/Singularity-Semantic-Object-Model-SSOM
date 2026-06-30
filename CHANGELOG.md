# Changelog

## Unreleased

### Added: Semantic Truth and Decision Lifecycle

- Added normative JSON Schemas for Source Assertion, Derived Assertion, Inference, Prediction, Recommendation, Decision, Action, and Outcome.
- Added shared truth-state schema definitions for evidence references, prediction horizon, responsible party, decision authority, outcome assessment, and correction or supersession lineage.
- Added a v0.4 fixture chain showing Observation through Outcome for a degrading pump vibration scenario.
- Added v0.4 migration guidance, schema reference documentation, examples, conformance checklist, and ADR documentation.

### Added: Asset Identity Lifecycle and Succession

- Added identity lifecycle support for canonical Asset identity, external identifiers, identifier assignments, scopes, authorities, aliases, functional-location references, and succession semantics.
- Added normative JSON Schemas for Functional Location and Identity Lifecycle Event.
- Added v0.5 identity lifecycle fixture bundles covering replacement, multi-source convergence, OPC UA node migration, duplicate tags across scopes, decommission and recommission, split, and merge scenarios.

### Changed: Identity Continuity Rules

- Asset identity now distinguishes canonical SSOM identity from external identifier assignments.
- Relationship vocabulary now includes succession semantics such as `replaces`, `succeeds`, `split_into`, and `merged_from`.
- README and RFC-0002 now explicitly distinguish Asset identity, Asset identifier, Asset class, Asset model, Functional Location, external source reference, and Asset succession.

### Changed: Scope and Positioning

- README and RFC-0002 now distinguish observations, assertions, inferences, predictions, recommendations, decisions, actions, and outcomes explicitly.
- README and RFC-0002 now label Event and Alarm semantics as planned profile scope until dedicated schemas are published.
- README no longer claims that SSOM already standardizes detailed work history or full AI reasoning behavior.

## v0.3.0 - 2026-06-29

### Added: Asset Equipment and Device Role Classification

- Asset is now explicitly defined as the canonical lifecycle identity for industrial entities across lifecycle, provenance, relationships, condition, work, and outcomes.
- Equipment and Device are now explicitly defined as distinct, overlapping operational classifications of Asset rather than mutually exclusive top-level types.
- The update is additive and backward-compatible with the v0.2 draft because the new schema fields are optional and existing Asset payloads remain valid.
- New governed vocabularies were added for asset forms, equipment roles, device roles, and lifecycle roles.
- New classification assertions preserve provenance, effective period, confidence, source-specific type retention, and derivation traceability.
- New examples, migration guidance, standards mapping notes, ServiceNow coexistence guidance, and conformance fixtures were added.
- Existing implementations should not infer that Equipment and Device are mutually exclusive.