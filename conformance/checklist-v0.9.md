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
- [ ] Utility-substation topology can represent relays, breakers, transformers, control cabinets, zones, and conduits in one governed bundle.

## Integrated Lifecycle Profile
- [ ] Pump P-101 integrated lifecycle bundle validates across truth-state, measurement-safety, reliability, and identity-continuity semantics.
- [ ] Original and replacement Pump P-101 assets have distinct canonical SSOM asset identities.
- [ ] Engineering tag `P-101` is reused only through non-overlapping validity periods.
- [ ] Immediate post-work vibration reduction does not automatically imply sustained reliability improvement.
- [ ] Recurrence remains linked to earlier work, outcome, and failure context.
- [ ] Replacement preserves predecessor or successor lineage and full provenance history.

## Capability Manifest Profile
- [ ] Capability manifests declare supported profiles with evidence references.
- [ ] Projected support claims declare a projection surface rather than implying executable support.
- [ ] Standards-mapping claims remain qualified unless a published crosswalk artifact is referenced.
- [ ] Placeholder XSD artifacts are marked deprecated and non-normative.
- [ ] Reference SQL artifacts are explicitly treated as examples rather than normative semantic definitions.

## Standards Discipline
- [ ] Implementations do not claim complete ISA-95 hierarchy conformance from the core boundary model alone.
- [ ] Implementations do not duplicate existing core relationship semantics under new synonymous codes without governance approval.

## BigQuery Reference Architecture
- [ ] Raw evidence, canonical facts, curated operational intelligence, serving projections, and AI datasets remain explicitly separated.
- [ ] High-frequency telemetry is not stored in transactional workflow-serving tables.
- [ ] Frequently queried telemetry and event fields are typed columns rather than JSON-only access paths.
- [ ] Corrected and superseded facts are append-preserving and lineage-aware.
- [ ] Serving projections and AI feature tables are rebuildable from canonical history.

## ServiceNow Serving Projection Profile
- [ ] ServiceNow projections remain curated, typed, and rebuildable rather than becoming the canonical evidence store.
- [ ] Pump, PLC, VFD, chiller, and robot-cell projection scenarios are covered by the serving-profile fixture.
- [ ] Raw historian samples, high-frequency telemetry, raw OPC UA payloads, ML feature records, raw event transitions, data-quality records, and analytical cohorts are excluded from workflow-primary storage.

## Functional Safety Foundation Profile
- [ ] Safety context keeps sensor element, logic solver, final element, and controlled process asset relationships explicit.
- [ ] Proof-test and work-verification evidence remain linked to safety context.
- [ ] Work closure while bypass remains active is rejected by the profile validator.

## OT Cybersecurity Foundation Profile
- [ ] Cyber context keeps firmware or software identity, network identity, zones, conduits, vulnerability references, posture references, and mitigation actions explicit.
- [ ] The profile covers a networked vulnerable VFD, a PLC communicating through a conduit, and a safety controller with cyber-managed identity.
- [ ] The profile is bounded as foundational OT cyber interoperability context rather than a complete cybersecurity management surface.