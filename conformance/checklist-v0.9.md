# SSOM v0.9 Conformance Checklist

## Core Compatibility
- [ ] Existing v0.3 through v0.8 fixtures remain valid.
- [ ] Asset Class, Equipment Model, Operational Boundary, and Relationship Registry records validate against their dedicated JSON Schemas.

## Relationship Governance Profile
- [ ] Core relationship types use governed SSOM relationship codes rather than unrestricted free text.
- [ ] Known inverse pairs remain consistent when reverse relationships are represented.
- [ ] Core relationship subject and object domains are valid.
- [ ] Functional Location is not modeled as Asset identity.
- [ ] Asset Class and Equipment Model are not modeled as serialized Asset instances.
- [ ] Systems, Process Segments, Production Units, and Control Entities can be represented as non-serialized operational boundaries.
- [ ] Namespaced extension relationships preserve source-specific relationship semantics with mapping metadata and provenance.
- [ ] Time-bounded relationships preserve valid temporal intervals.

## Integrated Lifecycle Profile
- [ ] Pump P-101 integrated lifecycle bundle validates across truth-state, measurement-safety, reliability, and identity-continuity semantics.
- [ ] Original and replacement Pump P-101 assets have distinct canonical SSOM asset identities.
- [ ] Engineering tag `P-101` is reused only through non-overlapping validity periods.
- [ ] Immediate post-work vibration reduction does not automatically imply sustained reliability improvement.
- [ ] Recurrence remains linked to earlier work, outcome, and failure context.
- [ ] Replacement preserves predecessor or successor lineage and full provenance history.

## Standards Discipline
- [ ] Implementations do not claim complete ISA-95 hierarchy conformance from the core boundary model alone.
- [ ] Implementations do not duplicate existing core relationship semantics under new synonymous codes without governance approval.