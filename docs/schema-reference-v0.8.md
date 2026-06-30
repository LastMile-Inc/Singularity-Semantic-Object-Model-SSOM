# SSOM v0.8 Schema Reference

## Event, alarm, and state-transition schemas

| Schema | Purpose | Required anchors |
| --- | --- | --- |
| `schemas/jsonschema/event.json` | Time-bound operational occurrence, detected change, or stateful happening | `event_id`, `subject_ref`, `event_type`, `event_category`, `event_time` |
| `schemas/jsonschema/alarm.json` | Governed alert condition with lifecycle, derivation, and suppression semantics | `alarm_id`, `subject_ref`, `alarm_type`, `alarm_state`, `raised_at`, `derivation_type` |
| `schemas/jsonschema/state-transition.json` | Explicit change from one declared state to another with evidence and timing | `transition_id`, `subject_ref`, `state_subject_type`, `from_state`, `to_state`, `transition_type`, `event_time` |

## Shared event and alarm definitions

The following reusable definitions are defined in `schemas/jsonschema/common.json`:

- `eventCategory`
- `eventSourcePayload`
- `alarmState`
- `alarmStateTransitionType`
- `stateTransitionContext`
- `thresholdReference`
- `alarmDerivationType`
- `alarmLifecycleContext`
- `suppressionContext`

## Reuse notes

- `event.json` can carry an inline `state_transition` when the state change is inseparable from the event.
- `alarm.json` preserves canonical alarm state separately from the original source alarm state when available.
- `state-transition.json` exists so lifecycle changes can be referenced independently from the enclosing Event or Alarm.
- Recommendations, Work Requests, Work Executions, and Work Verifications remain distinct downstream semantics; Alarm does not replace them.

## Compatibility notes

- Existing v0.7 reliability and work fixtures remain valid.
- Existing v0.6 measurement-safety fixtures remain valid.
- Existing v0.5 identity lifecycle fixtures remain valid.
- Existing v0.4 truth-state fixtures remain valid.
- Existing v0.3 Asset, Relationship, Observation, and Condition fixtures remain valid.
