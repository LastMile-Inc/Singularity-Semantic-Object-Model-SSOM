# Changelog

## Unreleased

### Added: Industry Profiles And Candidate-Specification Package

- Added initial bounded industry-profile scaffolds for process manufacturing, discrete manufacturing, utilities and electric power, water and wastewater, and facilities and data centers, each with an end-to-end example fixture.
- Added a candidate-specification package and release-readiness assessment covering governance, conformance, capability evidence, standards traceability, BigQuery architecture, ServiceNow coexistence, claims discipline, and publication posture.

### Changed: Candidate Review Positioning

- README, capability-manifest posture, migration guidance, and conformance checklist now reflect candidate-spec external review readiness while preserving draft and qualified-claims boundaries.

### Added: Serving, Safety, And Cyber Foundation Profiles

- Added a formal ServiceNow serving projection profile with a typed curated projection bundle and fixture coverage for pump, PLC, VFD, chiller, and robot-cell scenarios.
- Added a functional safety foundation profile with bounded safety context, proof-test evidence, bypass visibility, and a negative fixture proving work closure cannot hide an active bypass.
- Added an OT cybersecurity foundation profile with bounded cyber-managed asset, firmware or software identity, network identity, zone, conduit, vulnerability, posture, mitigation, and cyber-event semantics.

### Changed: Standards And Capability Evidence

- Upgraded ServiceNow, safety, and cyber profile references from documentation-only placeholders to formal profile docs, schemas, fixtures, and validator-backed capability-manifest evidence.
- Updated standards mapping, profile applicability, migration guidance, README boundary language, and conformance checklist entries to preserve the qualified interoperability boundary.

### Added: Layered BigQuery Reference Architecture

- Replaced illustrative BigQuery SQL with a layered BigQuery reference architecture covering raw evidence, canonical SSOM facts, curated operational intelligence, serving projections, and AI feature or evaluation datasets.
- Added typed BigQuery DDL for dataset creation, canonical fact history, relationship and identity history, observation and event tables, serving projections, graph-edge views, and AI feature or label surfaces.
- Added reference queries for condition trends, cross-site peer comparison, action-to-outcome effectiveness, late-arriving corrections, ServiceNow serving projections, and AI retrieval context.

### Changed: BigQuery Guidance And Migration Notes

- Added a dedicated BigQuery architecture document covering event-time partitioning, clustering, workload shapes, late-arriving data, correction lineage, replay, retention, governance, residency, cost controls, and deployment limits.
- Expanded implementation-boundary and migration guidance so BigQuery reference artifacts stay clearly separate from the normative SSOM semantic contract.

### Added: Traceable Standards Crosswalks And Claims Boundaries

- Added a reusable standards-mapping artifact schema and structured Prompt 8 artifacts for the standards crosswalk matrix, source-system mapping guidance, transformation-loss register, profile applicability matrix, and standards claims matrix.
- Added field-level, qualified mapping entries for MIMOSA, ISA-95, OPC UA, O-PAS, ISO 14224, ISO 55000, IEC 81346, IEC 62443, IEC 61511, ISA-18 or IEC 62682, ISA-88, B2MML, and AutomationML.
- Added validator checks proving mapping artifacts include maturity and limitation fields, profile-dependent mappings identify required profiles, and README standards language stays within the allowed claim boundary.

### Changed: Standards Documentation

- README now positions SSOM as an AI-native semantic bridge and links to the new structured crosswalk artifacts.
- ServiceNow coexistence guidance now points to the structured Prompt 8 source-system mapping artifact.

### Added: Capability Manifest And Topology Coverage

- Added a capability-manifest JSON Schema plus valid and invalid fixtures covering supported profile declarations, executable evidence, qualified standards-mapping claims, and legacy-artifact posture.
- Added semantic validation rejecting duplicate profile claims, unsupported published-crosswalk claims, and placeholder XSDs that are not marked deprecated and non-normative.
- Added a v0.9 utility-substation relationship bundle proving SSOM can represent relays, breakers, transformers, control cabinets, zones, and conduits in one governed topology.

### Changed: Governance And Legacy Artifact Posture

- Expanded governance with controlled vocabulary stewardship, extension namespace registration, profile approval, versioning, deprecation workflow, ADR expectations, standards-mapping review, security disclosure, and public-versus-proprietary boundary guidance.
- Marked placeholder XSD artifacts as deprecated non-normative compatibility markers and clarified that reference BigQuery SQL is example-only rather than a normative semantic definition.

### Added: P0 Closure Edge-Case Hardening

- Added v0.4 truth-state lineage fixtures proving corrected source assertions, superseded derived assertions, revised inferences, superseded recommendations, and reassessed outcomes preserve original evidence, provenance, and temporal context.
- Added v0.6 measurement fixtures proving raw evidence with unknown or ungoverned units may be preserved without being falsely normalized or marked safely comparable.
- Added a v0.7 multi-cycle recurrence bundle proving recurrence can link prior condition, prior work, verification, outcome, failure history, and maintenance-strategy change context explicitly.
- Added semantic validation for truth-state supersession lineage, unknown-unit comparability restrictions, and recurrence-aware work-history linkage.

### Changed: Standards Claim Discipline

- Standards-mapping, README, and RFC wording now describe conceptual alignment and semantic-preservation intent rather than implying formal interoperability, profile completeness, or standards-certified behavior.

### Added: Integrated Pump Lifecycle Cross-Feature Conformance

- Added an executable Pump P-101 integrated lifecycle bundle proving truth-state, measurement-safety, reliability outcome, recurrence, and replacement identity continuity work together in one end-to-end scenario.
- Added an invalid integrated bundle proving overlapping engineering-tag reuse across original and replacement assets is rejected.
- Added semantic validation proving short-term vibration reduction does not automatically imply sustained reliability improvement and that replacement preserves history without reusing canonical identity.

### Added: Governed Relationship Registry and Operational Boundary Semantics

- Added dedicated schemas for Asset Class, Equipment Model, and Operational Boundary plus governed relationship typing for core and namespaced extension relationship codes.
- Added a machine-readable core relationship registry with inverse, family, domain, direction, cardinality, temporal, profile, and alias metadata.
- Added v0.9 relationship fixtures for cooling-water system composition, drive and power chains, robot-cell context, process-segment flow, and namespaced source relationship preservation.
- Added semantic validation proving inverse-pair integrity, subject and object domain validity, extension namespace stewardship, free-text rejection, and temporal validity for relationships.

### Changed: Ontology Boundaries

- README and RFC-0002 now distinguish Asset instances from Asset Classes, Equipment Models, Functional Locations, and non-serialized operational boundaries such as Systems, Process Segments, Production Units, and Control Entities.
- Core relationship guidance now rejects unrestricted free-text core relationship types and reserves detailed ISA-95 style hierarchy expansion for profiles rather than the core model.

### Added: Event, Alarm, and State-Transition Semantics

- Added dedicated schemas for Event, Alarm, and State Transition plus shared event-category, alarm-state, threshold, suppression, source-payload, and transition definitions.
- Added v0.8 fixtures for VFD fault event-to-alarm-to-recommendation flow, communication-loss event without alarm, threshold-breach alarm, maintenance suppression, safety bypass activation, late-arriving historian event evidence, and false-alarm verification after instrument drift.
- Added semantic validation proving event and alarm records stay distinct from free-form Observation or Condition text, alarm lifecycle transitions remain valid, suppression or shelving retains provenance and valid interval, late-arrival timing is preserved, and source payload preservation remains possible.

### Changed: Scope and Positioning

- README and RFC-0002 now treat Event, Alarm, and State Transition as first-class schema-backed semantics rather than planned profile scope.
- Canonical Operational Record envelope now includes `state_transition` as a governed `record_type`.

### Added: Reliability Work and Outcome Semantics

- Added dedicated schemas for Symptom, Failure Mode, Failure Mechanism, Failure Cause, Failure Event, Diagnostic, Prognostic, Maintenance Strategy, Work Request, Work Plan, Work Execution, Work Verification, and Work Outcome.
- Added v0.7 bundle fixtures for motor-bearing degradation, ineffective pump seal replacement, VFD replacement with configuration restoration, safety-related proof-test evidence, recommendation-to-decision without action, and neutral post-work outcome.
- Added semantic validation proving verified work outcomes require verification evidence, work outcomes preserve intended versus observed results, structured failure semantics cannot collapse into free-form text, and completed work may lead to positive, neutral, inconclusive, or ineffective outcomes.

### Changed: Reliability And Maintenance Scope

- RFC-0002 and README now distinguish failure mode, failure mechanism, failure cause, work request, work execution, work verification, and measurable work outcome.
- RFC-0002 and README now explicitly state that a completed work execution is not proof of restored function.
- Standards mapping language now uses qualified ISO 14224-like and MIMOSA-like alignment language only.

### Added: Measurement and Unit Safety Semantics

- Added structured Observation semantics for original source measurement, canonical normalized measurement, governed unit references, conversion lineage, structured measurement quality, calibration context, signal context, and time-synchronization context.
- Added semantic validation and v0.6 fixtures for pressure, temperature, vibration acceleration, flow, valve position, stale data, overdue calibration, and late-arriving historian observations.
- Added negative tests proving incompatible quantity kinds and incompatible units are rejected or flagged, canonical measurement requires explicit quantity kind, conversion lineage requires source-unit traceability, and structured calibration fields are preferred over free-form notes.

### Changed: Observation Safety Rules

- Observation guidance now warns that a value is not operationally comparable merely because it is numeric.
- RFC-0002 and README now distinguish source unit, canonical unit, quantity kind, engineering unit, display unit, conversion reference, measurement quality, and operational context.

### Added: Semantic Truth and Decision Lifecycle

- Added normative JSON Schemas for Source Assertion, Derived Assertion, Inference, Prediction, Recommendation, Decision, Action, and Outcome.
- Added shared truth-state schema definitions for evidence references, prediction horizon, responsible party, decision authority, outcome assessment, and correction or supersession lineage.
- Added a v0.4 fixture chain showing Observation through Outcome for a degrading pump vibration scenario.
- Added v0.4 migration guidance, schema reference documentation, examples, conformance checklist, and ADR documentation.

### Added: Asset Identity Lifecycle and Succession

- Added identity lifecycle support for canonical Asset identity, external identifiers, identifier assignments, scopes, authorities, aliases, functional-location references, and succession semantics.
- Added normative JSON Schemas for Functional Location and Identity Lifecycle Event.
- Added v0.5 identity lifecycle fixture bundles covering replacement, multi-source convergence, OPC UA node migration, duplicate tags across scopes, decommission and recommission, split, and merge scenarios.

### Changed: Identity Continuity Rules

- Asset identity now distinguishes canonical SSOM identity from external identifier assignments.
- Relationship vocabulary now includes succession semantics such as `replaces`, `succeeds`, `split_into`, and `merged_from`.
- README and RFC-0002 now explicitly distinguish Asset identity, Asset identifier, Asset class, Asset model, Functional Location, external source reference, and Asset succession.

### Changed: Scope and Positioning

- README and RFC-0002 now distinguish observations, assertions, inferences, predictions, recommendations, decisions, actions, outcomes, events, alarms, and state transitions explicitly.
- README no longer claims that SSOM already standardizes detailed work history or full AI reasoning behavior.

## v0.3.0 - 2026-06-29

### Added: Asset Equipment and Device Role Classification

- Asset is now explicitly defined as the canonical lifecycle identity for industrial entities across lifecycle, provenance, relationships, condition, work, and outcomes.
- Equipment and Device are now explicitly defined as distinct, overlapping operational classifications of Asset rather than mutually exclusive top-level types.
- The update is additive and backward-compatible with the v0.2 draft because the new schema fields are optional and existing Asset payloads remain valid.
- New governed vocabularies were added for asset forms, equipment roles, device roles, and lifecycle roles.
- New classification assertions preserve provenance, effective period, confidence, source-specific type retention, and derivation traceability.
- New examples, migration guidance, standards mapping notes, ServiceNow coexistence guidance, and conformance fixtures were added.
- Existing implementations should not infer that Equipment and Device are mutually exclusive.