# SSOM v0.8 Migration Guidance

## What changed

SSOM v0.8 adds first-class Event, Alarm, and State Transition schemas. This update is additive and backward-compatible with v0.7 because existing records remain valid and the new semantics only become required when an implementation claims those profiles.

## Migration rules

- Emit `event.json` when something operationally happened and the primary need is to preserve occurrence, timing, evidence, or source payload.
- Emit `alarm.json` when governed attention, acknowledgment, suppression, shelving, or clearance semantics apply.
- Do not collapse alarms into free-form Observation or Condition text when typed Alarm semantics are available.
- Preserve original source alarm state alongside canonical alarm state whenever vendor-specific alarm vocabulary matters.
- Emit `state-transition.json` or inline event transition context when the change from one state to another must remain queryable as evidence.
- Preserve late-arriving evidence by keeping `event_time`, `receive_time`, and `processing_time` distinct.
- Preserve suppression or shelving provenance, valid interval, and work context where applicable.

## Practical mapping guidance

- Communication-loss detections can remain Events without implicitly creating Alarms.
- Threshold breaches should link Alarm records back to the triggering Observation and threshold reference.
- Temporary maintenance suppression should remain an Alarm lifecycle action, not a deleted or overwritten Alarm.
- False alarms should remain historically visible and can later be linked to verification evidence showing drift, misconfiguration, or other non-process causes.
