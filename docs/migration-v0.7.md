# SSOM v0.7 Migration Guide

SSOM v0.7.0 is an additive, backward-compatible release relative to the v0.6 draft.

## Migration summary

1. Existing Assets, Relationships, Conditions, identity lifecycle records, measurement-safe Observations, and truth-state records remain valid.
2. Maintenance workflows can now be modeled with explicit separation between work request, work plan, work execution, work verification, and work outcome.
3. Failure semantics now distinguish symptom, failure mode, failure mechanism, failure cause, and failure event.
4. Reliability, availability, and operational impacts can now be attached to structured work outcomes rather than inferred from closure status alone.

## Recommended migration steps

1. Preserve existing generic Recommendation, Decision, Action, and Outcome records. Do not replace them.
2. Introduce `work-request.json`, `work-plan.json`, `work-execution.json`, `work-verification.json`, and `work-outcome.json` when maintenance workflow traceability matters.
3. Introduce `symptom.json`, `failure-mode.json`, `failure-mechanism.json`, `failure-cause.json`, and `failure-event.json` when failure semantics need to be machine-readable rather than free-form.
4. Attach recurrence context and prior work references when failures recur.
5. Preserve reliability claims only when they are backed by asset class, operating context, measurement evidence, work history, and outcome evidence.

## Practical rules

- A work request is not work execution.
- A completed work execution is not proof of restored function.
- Work verification is the evidentiary step between execution and a verified outcome claim.
- A work outcome must preserve both intended and observed outcome.

## Compatibility statement

- **Status:** Fully backward-compatible and additive for existing v0.6 fixtures.
- **Migration warnings:** Systems that treat closed work as equivalent to successful remediation require semantic remediation.
- **Breaking changes:** None for legacy-conformant v0.6 Asset, Relationship, Observation, Condition, and truth-state payloads.