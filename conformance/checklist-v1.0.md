# SSOM v1.0 Conformance Checklist

## Core Compatibility
- [ ] Existing v0.3 through v0.9 fixtures remain valid.
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
- [ ] Reference-validation materials stay non-production, reproducible, parameterized, and free of invented performance claims.

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

## v1.0 Promotion Proof Coverage
- [ ] Smart-pump proof bundles preserve equipment, device, lifecycle, control, monitoring, cyber-risk, and work-outcome semantics in one end-to-end evidence package.
- [ ] Chiller multi-system proof bundles preserve seven-system identity convergence, source disagreement, workflow curation, and outcome feedback.
- [ ] AI comparability proof bundles separate comparable and non-comparable evidence before benchmark or model-input claims are made.
- [ ] ServiceNow outcome-feedback proof bundles preserve recommendation-to-execution-to-verification-to-updated-context closure without cross-tenant leakage.
- [ ] Invalid proof bundles reject unsupported cyber relationship codes, raw telemetry workflow projection, non-comparable feature inclusion, non-managed cyber assets, and duplicate industry-profile role declarations.

## Proprietary Last Mile Platform Profile Boundary
- [ ] The Last Mile platform-operations profile remains explicitly distinct from portable SSOM Core semantics.
- [ ] Tenant control planes reject raw evidence as shared or workflow-primary storage.
- [ ] Master-learning planes require approval-backed, policy-cleared comparable inputs rather than raw cross-tenant evidence.
- [ ] Observability and agent surfaces reject raw historian, high-frequency telemetry, and raw OPC UA payload mirroring.
- [ ] Master-profile bindings may depend on SSOM profile outputs without rebinding unknown tenants or redefining SSOM Core objects.

## Industry Profiles
- [ ] Process manufacturing, discrete manufacturing, utilities and electric power, water and wastewater, and facilities and data centers each have a bounded profile scaffold.
- [ ] Each industry profile defines scope, required or optional roles, measurement expectations, event or alarm expectations, reliability or work requirements, safety or cyber applicability, ServiceNow implications, standards applicability, exclusions, and an end-to-end example.

## Historical Promotion Inputs
- [ ] Candidate-specification package covers normative index, compatibility, governance, conformance, capability manifest, standards crosswalk, BigQuery reference architecture, ServiceNow coexistence, industry profiles, claims matrix, limitations, review guidance, and licensing boundary.
- [ ] Release-readiness assessment classifies external claims and recommends a publication posture without overstating maturity.

## v1.0 Release Gate
- [ ] README, RFC-0001, RFC-0002, the v1.0 discovery surface, the changelog, and the final release acceptance audit align on `SSOM Core v1.0.0`.
- [ ] The final release acceptance audit records a distinct approval decision for portable SSOM Core and the proprietary Last Mile platform-operations profile.
- [ ] Historical v0.9 candidate-review artifacts remain available without overriding the current v1.0 release decision.