# SSOM v0.4 Schema Reference

## Core truth-state schemas

| Schema | Purpose | Required anchors |
| --- | --- | --- |
| `schemas/jsonschema/observation.json` | Measured or reported operational value or state | `record_id`, `subject_ref`, `metric`, `value`, `event_time`, `quality`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/source-assertion.json` | Source-attributed statement that is not silently treated as fact | `assertion_id`, `assertion_type`, `subject_ref`, `asserted_value`, `asserted_at`, `assertion_state`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/derived-assertion.json` | Governed statement calculated from evidence | `assertion_id`, `assertion_type`, `subject_ref`, `asserted_value`, `derived_at`, `evidence_refs`, `derivation_method`, `confidence`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/inference.json` | Reasoned interpretation derived from evidence | `inference_id`, `inference_type`, `subject_ref`, `conclusion`, `evidence_refs`, `derivation_method`, `confidence`, `responsible_party`, `inferred_at`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/prediction.json` | Future-oriented estimate or probability statement | `prediction_id`, `prediction_type`, `subject_ref`, `prediction_target`, `predicted_value`, `prediction_horizon`, `predicted_at`, `derivation_method`, `confidence`, `evidence_refs`, `responsible_party`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/recommendation.json` | Proposed intervention or action | `recommendation_id`, `recommendation_type`, `target_ref`, `recommended_action`, `rationale`, `priority`, `confidence`, `evidence_refs`, `expected_outcome`, `recommended_at`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/decision.json` | Approval, rejection, deferral, selection, or override | `decision_id`, `decision_type`, `decision_status`, `context_refs`, `evidence_refs`, `decision_time`, actor or authority, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/action.json` | Executed intervention foundation for later work profiles | `action_id`, `action_type`, `target_ref`, `action_status`, `basis_refs`, `executed_at`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/outcome.json` | Measured or assessed result following a decision or action | `outcome_id`, `outcome_type`, `subject_ref`, `intended_outcome`, `observed_outcome`, `assessed_at`, `evidence_refs`, `confidence`, action or decision context, `provenance`, `temporal_integrity`, `ssom_version` |

## Shared supporting definitions

The following reusable definitions are defined in `schemas/jsonschema/common.json`:

- `confidenceScore`
- `evidenceRefs`
- `stateLineage`
- `responsibleParty`
- `decisionAuthority`
- `predictionHorizon`
- `expectedOutcome`
- `observedOutcome`
- `sourceAssertionState`
- `decisionStatus`
- `actionStatus`
- `priorityLevel`

## Lineage note

- `stateLineage` is the shared mechanism for correction, supersession, valid-from, and valid-to semantics across source assertions, derived assertions, inferences, recommendations, and outcomes.
- Implementations should preserve both prior and revised truth-state records so downstream consumers can reconstruct what was believed at a given time and why it later changed.

## Compatibility notes

- Existing v0.3 Asset, Relationship, Observation, and Condition fixtures remain valid.
- `canonical-operational-record.json` now recognizes truth-state lifecycle `record_type` values, but Event and Alarm remain reserved profile labels until dedicated schemas are published.