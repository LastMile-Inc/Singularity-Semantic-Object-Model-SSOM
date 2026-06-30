# SSOM v0.7 Reliability and Maintenance Profile

## Scope

This profile describes how SSOM v0.7.0 represents failure reasoning, maintenance workflow, verification evidence, and measurable work outcome without creating a second competing execution model.

SSOM reuses:

- Recommendation for proposed intervention
- Decision for approval, rejection, or deferral
- Action for execution foundation
- Outcome for assessed result foundation

SSOM adds:

- Symptom
- Failure Mode
- Failure Mechanism
- Failure Cause
- Failure Event
- Diagnostic
- Prognostic
- Maintenance Strategy
- Work Request
- Work Plan
- Work Verification
- Work Outcome

## Core distinctions

- Symptom is observed evidence, not a diagnosis.
- Failure mode is the way the function fails.
- Failure mechanism is the physical or logical process that produces the mode.
- Failure cause is the attributed reason the mechanism or event occurred.
- Work execution is not proof of restored function.
- Work verification is the evidentiary step between execution and a trusted outcome claim.

## Typical chain

Observation or Event or Condition -> Diagnostic -> Recommendation -> Decision -> Work Request -> Work Plan -> Work Execution -> Work Verification -> Work Outcome

## Query example

Practical question:

> Which maintenance action, performed on which asset class, under which operating conditions, produced the strongest measurable reliability improvement over time?

One SQL-like approach over SSOM-conformant records is:

```sql
SELECT
  outcome.reliability_impact.asset_class,
  outcome.work_execution_ref,
  outcome.reliability_impact.operating_context.operating_mode,
  outcome.reliability_impact.assessment_basis,
  outcome.reliability_impact.magnitude,
  outcome.reliability_impact.unit
FROM work_outcomes AS outcome
WHERE outcome.outcome_disposition = 'positive'
  AND outcome.reliability_impact.direction = 'improved'
ORDER BY outcome.reliability_impact.magnitude DESC NULLS LAST;
```

The important point is not the query language. It is the semantic traceability requirement behind it:

- asset class must be explicit
- operating context must be explicit
- measurement evidence refs must be preserved
- work history refs must be preserved
- intended and observed outcome must be distinct

Without those anchors, a closed work order cannot support a defensible reliability-improvement claim.

## Standards limits

SSOM can map to ISO 14224-like and MIMOSA-like semantics, but this profile does not claim formal compliance with either standard by default. Implementations need explicit mapping evidence, governed vocabularies, and verified data stewardship before making any stronger claim.