# SSOM v0.4 Migration Guide

SSOM v0.4.0 is an additive, backward-compatible release relative to the v0.3 draft.

## Migration summary

1. Existing Assets, Relationships, Observations, and Conditions remain valid.
2. Existing source statements should be mapped to Source Assertions rather than silently treated as facts.
3. Existing derived or analytical outputs should be mapped explicitly to Derived Assertion, Inference, Prediction, Recommendation, Decision, Action, or Outcome depending on their semantic role.
4. Contradictory source statements may now be preserved without forcing premature reconciliation.
5. Correction and supersession lineage can now be represented without deleting original evidence.
6. Detailed maintenance, work-execution, Event, and Alarm profiles remain planned profile scope.

## Recommended migration steps

1. Preserve existing `asset_id`, `record_id`, `condition_id`, and lineage evidence.
2. Continue emitting `observation.json` records for measured or reported values and states.
3. Emit `source-assertion.json` for operator, OEM, CMMS, CMDB, or model-generated source statements that are not raw measurements.
4. Emit `derived-assertion.json` when a governed transformation creates a derived statement from evidence.
5. Emit `inference.json` only when the implementation can identify evidence references, derivation method, confidence, and responsible model or actor.
6. Emit `prediction.json` only when target and horizon semantics are available.
7. Emit `recommendation.json`, `decision.json`, `action.json`, and `outcome.json` only when the required traceability fields can be supplied.
8. Preserve `state_lineage` when a truth-state record is corrected, superseded, or time-bounded.

## Mapping guidance

| Existing Pattern | Recommended v0.4 Mapping |
| --- | --- |
| Historian telemetry point | Observation |
| Operator note claiming normal state | Source Assertion |
| OEM advisory or CMMS source statement | Source Assertion |
| Rolling aggregate or rule-derived state | Derived Assertion |
| Diagnostic interpretation | Inference |
| Future risk score or forecast | Prediction |
| Proposed intervention | Recommendation |
| Approval, rejection, or override | Decision |
| Executed intervention record | Action |
| Measured or assessed post-action result | Outcome |

## Compatibility statement

- **Status:** Fully backward-compatible and additive for existing v0.3 fixtures.
- **Migration warnings:** Implementations that currently blur source statements, inferences, and recommendations into one generic object require explicit mapping updates.
- **Breaking changes:** None for legacy-conformant v0.3 Asset, Relationship, Observation, and Condition payloads.