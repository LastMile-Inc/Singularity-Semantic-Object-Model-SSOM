# Changelog

## Unreleased

### Added: Semantic Truth and Decision Lifecycle

- Added normative JSON Schemas for Source Assertion, Derived Assertion, Inference, Prediction, Recommendation, Decision, Action, and Outcome.
- Added shared truth-state schema definitions for evidence references, prediction horizon, responsible party, decision authority, outcome assessment, and correction or supersession lineage.
- Added a v0.4 fixture chain showing Observation through Outcome for a degrading pump vibration scenario.
- Added v0.4 migration guidance, schema reference documentation, examples, conformance checklist, and ADR documentation.

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