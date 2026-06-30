# SSOM v0.7 Schema Reference

## Reliability and work schemas

| Schema | Purpose | Required anchors |
| --- | --- | --- |
| `schemas/jsonschema/symptom.json` | Directly observed operational symptom | `symptom_id`, `subject_ref`, `symptom_type`, `symptom_ref`, `first_observed_at` |
| `schemas/jsonschema/failure-mode.json` | Distinct way an asset or function fails | `failure_mode_id`, `subject_ref`, `failure_mode_ref`, `affected_function`, `classified_at` |
| `schemas/jsonschema/failure-mechanism.json` | Physical or logical process producing a failure mode | `failure_mechanism_id`, `subject_ref`, `failure_mechanism_ref`, `evidence_refs`, `inferred_at`, `confidence` |
| `schemas/jsonschema/failure-cause.json` | Attributed causal factor for a failure | `failure_cause_id`, `subject_ref`, `failure_cause_ref`, `evidence_refs`, `determined_at`, `confidence` |
| `schemas/jsonschema/failure-event.json` | Time-bound loss or degradation event | `failure_event_id`, `subject_ref`, `failure_mode_ref`, `event_status`, `occurred_at`, `evidence_refs` |
| `schemas/jsonschema/diagnostic.json` | Reasoned diagnosis or failure hypothesis | `diagnostic_id`, `subject_ref`, `diagnostic_type`, `diagnostic_status`, `conclusion`, `evidence_refs`, `diagnosed_at`, `confidence` |
| `schemas/jsonschema/prognostic.json` | Future-oriented degradation or failure projection | `prognostic_id`, `subject_ref`, `prognostic_type`, `forecast`, `prediction_horizon`, `evidence_refs`, `predicted_at`, `confidence`, `responsible_party`, `prognostic_status` |
| `schemas/jsonschema/maintenance-strategy.json` | Governed maintenance intent | `strategy_id`, `subject_ref`, `strategy_type`, `objective`, `evidence_refs`, `effective_from` |
| `schemas/jsonschema/work-request.json` | Governed request for work | `work_request_id`, `subject_ref`, `request_type`, `request_status`, `requested_action`, `basis_refs`, `requested_at` |
| `schemas/jsonschema/work-plan.json` | Planned work steps, verification method, parts, and labor context | `work_plan_id`, `subject_ref`, `work_request_ref`, `plan_status`, `planned_actions`, `planned_verification_method`, `expected_outcome`, `planned_start` |
| `schemas/jsonschema/work-execution.json` | Action specialization for maintenance execution | `action_id`, `action_type = work_execution`, `work_request_ref`, `work_plan_ref`, `verification_required` plus Action anchors |
| `schemas/jsonschema/work-verification.json` | Evidentiary validation or rejection of restoration | `verification_id`, `subject_ref`, `work_execution_ref`, `verification_status`, `verification_method`, `restoration_status`, `evidence_refs`, `verified_at` |
| `schemas/jsonschema/work-outcome.json` | Outcome specialization for measured work result | `outcome_id`, `outcome_type = work_outcome`, `work_execution_ref`, `verification_refs`, `outcome_disposition` plus Outcome anchors |

## Shared reliability and work definitions

The following reusable definitions are defined in `schemas/jsonschema/common.json`:

- `governedTermReference`
- `diagnosticStatus`
- `prognosticStatus`
- `failureEventStatus`
- `maintenanceStrategyType`
- `workRequestStatus`
- `workPlanStatus`
- `verificationStatus`
- `restorationStatus`
- `workOutcomeDisposition`
- `recurrenceStatus`
- `materialUsage`
- `laborParticipation`
- `serviceInterruption`
- `operatingContextSnapshot`
- `impactAssessment`
- `reliabilityImpact`
- `warrantyCoverage`
- `recurrenceContext`

## Reuse notes

- `work-execution.json` reuses `action.json` as the execution foundation.
- `work-outcome.json` reuses `outcome.json` as the assessed-result foundation.
- Recommendations and Decisions remain the upstream intent and approval semantics for work; they are not duplicated.

## Recurrence note

- `recurrenceContext`, `reliabilityImpact`, and the work-history reference fields are intended to preserve explicit multi-cycle evidence, not just a textual claim that a failure repeated.
- Reliable recurrence reasoning should link prior condition, prior work, prior verification, prior outcome, and any resulting maintenance-strategy change when those records exist.

## Compatibility notes

- Existing v0.6 measurement-safety fixtures remain valid.
- Existing v0.5 identity lifecycle fixtures remain valid.
- Existing v0.4 truth-state fixtures remain valid.
- Existing v0.3 Asset, Relationship, Observation, and Condition fixtures remain valid.