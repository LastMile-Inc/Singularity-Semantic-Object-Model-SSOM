# SSOM v0.7 Conformance Checklist

## Core Asset, Identity, and Measurement Profile
- [ ] Existing Asset, Relationship, identity lifecycle, and measurement-safety requirements remain satisfied.
- [ ] Legacy v0.3, v0.4, v0.5, and v0.6 fixtures remain valid.

## Reliability and Work Profile
- [ ] Symptoms remain distinct from Diagnostics.
- [ ] Failure Mode, Failure Mechanism, and Failure Cause remain distinct structured semantics.
- [ ] Work Request remains distinct from Work Execution.
- [ ] Work Execution reuses Action semantics rather than creating a competing execution model.
- [ ] Work Outcome reuses Outcome semantics rather than creating a competing outcome model.
- [ ] Work Verification identifies the evidence used to validate or reject restoration.
- [ ] Work Outcome preserves both intended and observed outcome.
- [ ] Reliability claims reference asset class, operating context, measurement evidence, work history, and outcome evidence.
- [ ] Recurring failures can link to prior work and prior failure history.
- [ ] Multi-cycle recurrence retains explicit links to prior condition, prior verification, prior outcome, prior failure event, and prior work history.
- [ ] Recurrence can justify a governed maintenance-strategy change rather than being preserved only as narrative text.
- [ ] Parts, labor, service interruption, and warranty context are representable where relevant.

## Standards Discipline
- [ ] Implementations do not claim ISO 14224 compliance from terminology mapping alone.
- [ ] Implementations do not claim MIMOSA conformance from lifecycle or work-history alignment alone.
- [ ] Implementations do not treat closed work as proof of restored function without verification evidence.