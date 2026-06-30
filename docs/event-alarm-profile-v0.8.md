# SSOM Event and Alarm Profile v0.8

## Purpose

This profile defines how SSOM represents operational occurrences, governed alarms, and explicit state transitions without collapsing those semantics into Observation, Condition, or vendor-specific extension text.

## Profile rules

- Event records capture that something happened.
- Alarm records capture that governed attention or suppression semantics apply.
- State Transition records capture explicit changes from one declared state to another when the transition must remain independently referenceable.
- Alarm lifecycle must remain explicit across `active`, `acknowledged`, `cleared`, `suppressed`, `shelved`, and `unknown` canonical states.
- Original source alarm state should be preserved whenever a source system uses richer or vendor-specific alarm-state vocabulary.
- Suppression or shelving must retain provenance and a valid interval.
- Late-arriving event evidence must retain event time separately from receive and processing time.
- Source payload may be preserved inline or by durable reference when implementations need forensic traceability.

## Distinction rules

- Observation is not Alarm.
- Condition is not Alarm.
- Recommendation is not Alarm.
- Event is not automatically Alarm.
- Alarm does not replace downstream Recommendation, Decision, Action, Work Execution, Work Verification, or Outcome semantics.

## Example scenarios covered by conformance fixtures

- Fault event leading to alarm and recommendation
- Communication-loss event without alarm
- Threshold-breach alarm from observation
- Alarm suppression during maintenance work
- Safety bypass activation with explicit work context
- Late-arriving historian event preserving prior evidence
- False alarm linked to instrument drift and later verification
