# SSOM v0.8 Conformance Checklist

## Core Compatibility
- [ ] Existing v0.3, v0.4, v0.5, v0.6, and v0.7 fixtures remain valid.
- [ ] Event, Alarm, and State Transition records validate against their dedicated JSON Schemas.

## Event and Alarm Profile
- [ ] Event is kept distinct from Alarm.
- [ ] Alarm is not represented solely as uncontrolled string content in Observation or Condition.
- [ ] Alarm lifecycle transitions remain state-consistent and time-ordered.
- [ ] Canonical alarm state is preserved separately from original source alarm state when source vocabulary differs.
- [ ] Suppression or shelving retains provenance and explicit valid interval.
- [ ] Threshold-driven alarms preserve observation linkage and threshold reference.
- [ ] Communication-loss or similar operational occurrences can be represented as Events without implying an Alarm.
- [ ] State transitions can be preserved independently of the enclosing Event or Alarm when needed.
- [ ] Late-arriving event evidence retains event time separately from receive and processing time.
- [ ] Source payload preservation remains possible inline or by durable reference.

## Standards Discipline
- [ ] Implementations do not claim ISA-18.2 or IEC 62682 compliance from typed Alarm support alone.
- [ ] Implementations do not delete or overwrite false alarms when later verification shows drift or misconfiguration.
