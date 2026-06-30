# RFC-0002: SSOM Core, Operational Context, and Conformance

- **Status:** Draft
- **Category:** Standards Track
- **Intended Version:** SSOM v0.7.0
- **Created:** 2026-06
- **Updates:** RFC-0001
- **License:** Apache-2.0

## Abstract

This RFC evolves the Standardized Semantic Object Model (SSOM) from an initial conceptual model into an implementable, vendor-neutral semantic standard for operational technology and industrial operations data.

SSOM defines portable semantics for operational records, evidence, and governed truth-state transitions. It does not define a workflow engine, SaaS administration model, dashboard system, cloud architecture, source-platform product model, or vendor-specific implementation.

SSOM v0.3.0 added a formally governed way to distinguish **Equipment** and **Device** as overlapping operational classifications of an **Asset** while preserving Asset as the canonical lifecycle identity.

SSOM v0.4.0 adds a formally governed semantic truth and decision lifecycle that distinguishes **Observation**, **Source Assertion**, **Derived Assertion**, **Inference**, **Prediction**, **Recommendation**, **Decision**, **Action**, and **Outcome**.

SSOM v0.5.0 adds a formally governed asset identity lifecycle that distinguishes canonical Asset identity, external identifiers, identifier assignments, scope, authority, aliases, succession, and identity-affecting lifecycle events.

SSOM v0.6.0 adds measurement-safety semantics so Observations can preserve original source measurement, canonical normalized measurement, governed unit and quantity references, conversion lineage, quality state, calibration context, signal context, and time-synchronization context.

SSOM v0.7.0 adds first-class failure, maintenance, work verification, and work outcome semantics so implementations can represent whether an intervention addressed the relevant failure mechanism, restored intended function, reduced risk, improved reliability, or failed to produce improvement.

## 1. Motivation

Operational systems commonly produce records that are difficult to combine across platforms because the record alone does not explain:

- what entity or asset it refers to;
- whether multiple identifiers refer to the same Asset or to different Assets over time;
- whether that entity is functioning as equipment, a device, both, or neither;
- which source system supplied it;
- whether its timestamp, quality, and identity are reliable;
- which transformation or mapping created the semantic representation;
- which related assets, locations, or systems provide context; and
- whether an operational finding is merely a signal or a meaningful condition.

A practical semantic standard must preserve that context without becoming a replacement for source platforms, transport systems, workflow products, or operational applications.

## 2. Scope

### 2.1 SSOM covers

SSOM specifies transport-independent semantics for:

1. Asset
2. Functional Location
3. Relationship
4. Identity Lifecycle Event
5. Observation
6. Source Assertion
7. Derived Assertion
8. Inference
9. Prediction
10. Recommendation
11. Decision
12. Action
13. Outcome
14. Condition
15. Operational Context
16. Provenance
17. Quality
18. Temporal Integrity
19. Policy Evidence
20. Symptom
21. Failure Mode
22. Failure Mechanism
23. Failure Cause
24. Failure Event
25. Diagnostic
26. Prognostic
27. Maintenance Strategy
28. Work Request
29. Work Plan
30. Work Verification
31. Work Outcome
32. Extension and conformance metadata

Event and Alarm labels remain reserved profile scope in the Canonical Operational Record envelope, but dedicated Event and Alarm schemas are not normative in this repository version.

### 2.2 SSOM does not cover

SSOM does not define:

- transport protocols or protocol bindings;
- control logic or direct actuation;
- source-system implementation;
- product-private workflow state;
- product-private user, tenant, billing, credential, or support data;
- dashboard layout, visualization, or user-interface state;
- a required data store, event bus, cloud provider, or deployment topology; or
- any implied right to share or aggregate data.

### 2.3 SSOM as semantic model, not database

SSOM is a semantic standard. Implementations may materialize SSOM-conformant data in analytical stores, transactional stores, graph stores, event archives, or data lakes according to workload needs.

Implementations should separate:

- semantic operational records and governed truth states;
- derived current-state projections;
- raw source evidence; and
- implementation-private application state.

The existence of an SSOM-conformant record does not prescribe a specific persistence model.

## 3. Normative language

The terms **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** are to be interpreted as described in RFC 2119 and RFC 8174.

## 4. Design principles

1. **Vendor neutrality.** SSOM MUST not privilege a vendor, source platform, transport, database, or cloud provider.
2. **Meaning before transport.** SSOM models operational meaning independently of the delivery mechanism.
3. **Source authority remains visible.** Normalization MUST preserve source origin and authority.
4. **Global identity with uncertainty.** SSOM MUST support shared asset identity while representing identity confidence and unresolved identity.
5. **Explicit relationships.** Important operational relationships MUST be representable as first-class links.
6. **Temporal integrity.** Event, source, receive, and processing time MUST be distinguishable where available.
7. **Quality is first-class.** Consumers MUST be able to understand whether an operational record is good, uncertain, bad, estimated, missing, late, or incomplete.
8. **Provenance and lineage are first-class.** An implementation MUST be able to trace a semantic record to source and transformation context.
9. **Extensibility without mutation.** Domain-specific additions MUST not redefine core semantics.
10. **Operational neutrality.** SSOM MAY reference operational context and policy evidence but MUST NOT become a workflow or application-control schema.
11. **AI-ready and explainable.** SSOM SHOULD retain the context required for people and models to understand a record and its confidence.
12. **Implementation portability.** SSOM MUST support multiple serializations and storage patterns.
13. **Truth-state separation.** SSOM MUST distinguish observation, assertion, inference, prediction, recommendation, decision, action, and outcome semantics.
14. **Identity continuity.** SSOM MUST preserve canonical Asset identity separately from external identifiers, time-bound assignments, and succession semantics.
15. **Measurement safety.** SSOM MUST preserve original measurement semantics separately from canonical normalized measurement semantics and MUST NOT treat a numeric value as operationally comparable without governed quantity, unit, quality, and timing context.
16. **Verified operational outcome.** SSOM MUST distinguish work request, work execution, work verification, and work outcome semantics so a completed action is not silently treated as proof of restored function.

## 5. Core semantic objects

### 5.1 Asset

An **Asset** is the canonical lifecycle identity for a physical or logical entity that participates in industrial operations and can have identity, relationships, condition, history, context, value, risk, work, or outcome significance.

Assets may be physical, logical, composite, virtual, software-based, or cyber-managed.

Asset is the canonical lifecycle identity for any physical or logical entity that participates in industrial operations. Equipment and Device are distinct operational classifications of an Asset, not mutually exclusive top-level entity types. Equipment denotes an Asset whose primary role is to perform or support a process, production, utility, material-handling, facility, or operational function. Device denotes an Asset whose primary role is sensing, measurement, control, actuation, protection, computation, communications, or technical interface. An Asset may be classified as Equipment, Device, both, or neither where the available evidence does not support either classification.

An Asset MUST include:

- `asset_id`
- `asset_type`
- `display_name`
- `lifecycle_state`
- `identity`
- `ssom_version`

An Asset MAY include:

- identity lifecycle semantics such as identifier assignments, aliases, and source-preserving continuity records
- `asset_form`
- `equipment_roles[]`
- `device_roles[]`
- `lifecycle_roles[]`
- `primary_operational_role`
- `classification_assertions[]`
- manufacturer or model metadata
- serial number
- operational criticality
- spatial reference
- domain extensions
- context references

#### 5.1.1 Asset identity, identifier, and succession distinctions

SSOM distinguishes the following identity-related concepts:

- **Canonical Asset identity:** the stable SSOM identity of an Asset.
- **External Identifier:** a source-specific or business-specific identifier associated with an Asset.
- **Identifier Assignment:** a time-bound association between an Asset and an External Identifier.
- **Identifier Scope:** the context in which an identifier value is unique.
- **Identifier Authority:** the organization or source system responsible for the identifier.
- **Identity Alias:** a secondary or alternative identifier associated with the same Asset.
- **Functional Location:** a distinct operational or engineering location context that MUST NOT be treated as the same thing as Asset identity.
- **Asset Succession:** a governed continuity relationship indicating replacement, predecessor, successor, split, merge, supersession, decommissioned-as, or recommissioned-as semantics.

An Asset class or source type is not the same thing as an Asset identifier. A manufacturer model designation is not the same thing as a serialized Asset identity. A functional location is not the same thing as the Asset occupying that location.

#### 5.1.2 Normative asset identity rules

1. A canonical SSOM Asset ID MUST be globally unique and MUST NOT be reused.
2. An Asset MAY hold multiple external identifiers at the same time.
3. The same identifier value MAY be assigned to different Assets over time when validity periods do not overlap within the same scope and authority.
4. A replacement Asset MAY inherit the same engineering tag or functional location without becoming the same Asset.
5. Source identities MUST be preserved even when they conflict.
6. Source identity conflict MUST NOT force deletion of either source assertion or identifier assignment.
7. Identifier assignments MUST support provenance, confidence, verification status, validity period, scope, and authority.
8. Functional location references MUST remain distinguishable from Asset identity.
9. No schema or validator may assume that an engineering tag, historian path, CMDB CI number, or OPC UA node identifier is globally immutable.
10. Asset succession relationships MUST support at least `replaces`, `replaced_by`, `succeeds`, `preceded_by`, `split_into`, `merged_from`, `decommissioned_as`, and `recommissioned_as`.

#### 5.1.3 Normative asset-classification rules

1. An Asset MUST remain the canonical identity for lifecycle, provenance, relationships, condition, actions, and outcomes.
2. Equipment and Device MUST NOT be modeled as mutually exclusive inheritance branches.
3. An Asset MAY carry one or more Equipment roles and one or more Device roles at the same time.
4. Equipment and Device classifications SHOULD preserve source, provenance, effective period, confidence, and semantic-profile information where the existing SSOM model supports those concepts.
5. Where a source system exposes a vendor-specific type, SSOM SHOULD preserve the source type and map it to SSOM classifications without discarding the source assertion.
6. The model MUST permit a smart or connected operational asset, such as a VFD, CNC, robot, smart valve, smart pump, packaged chiller, or control skid, to be represented as both Equipment and Device.
7. The model MUST distinguish a functional system or process segment from a physical Asset instance unless the system itself is explicitly managed as an Asset.
8. The model SHOULD allow Equipment and Device classifications to be derived from source-system data, but derived classifications MUST remain traceable to their source or derivation logic.

#### 5.1.4 Asset forms

SSOM v0.3.0 defines the following core `asset_form` values:

- `system`
- `unit`
- `machine`
- `assembly`
- `component`
- `instrument`
- `controller`
- `software`
- `logical_asset`

Additional asset forms MAY be introduced only through a governed extension or profile mechanism.

#### 5.1.5 Equipment roles

Equipment is an Asset classification representing an entity whose primary role is to perform, support, enable, contain, transport, transform, regulate, or otherwise contribute directly to a process, production, utility, facility, or material-handling function.

Core `equipment_roles[]` values are:

- `process_equipment`
- `utility_equipment`
- `material_handling_equipment`
- `facility_equipment`
- `production_equipment`

Equipment classifications commonly support operational concepts such as functional purpose, process role, maintainability, reliability context, availability, criticality, performance, capacity, operating envelope, production impact, safety impact, and energy impact.

Examples include pumps, compressors, chillers, boilers, turbines, conveyors, packaging machines, production skids, robot cells, reactor vessels, air-handling units, motor control centers, electrical switchgear, production lines, and water-treatment systems.

#### 5.1.6 Device roles

A Device is an Asset classification representing an entity whose primary role is sensing, measurement, control, actuation, protection, computation, communication, protocol mediation, technical interface, or control-system interaction.

Core `device_roles[]` values are:

- `sensing_device`
- `measurement_device`
- `actuation_device`
- `control_device`
- `protection_device`
- `communication_device`
- `compute_device`

Device classifications commonly support technical concepts such as control capability, sensing or measurement capability, actuation capability, protection capability, communications protocol, network identity, firmware state, configuration state, cybersecurity state, diagnostic capability, data quality, calibration, signal range, interface model, supported methods, event capability, alarm capability, and telemetry capability.

Examples include PLCs, RTUs, HMIs, VFDs, sensors, transmitters, smart valves, motor relays, safety controllers, industrial gateways, network switches, industrial PCs, cameras, RFID readers, OPC UA servers, embedded controllers, and protection relays.

#### 5.1.7 Lifecycle roles

Core `lifecycle_roles[]` values are:

- `serialized_asset`
- `maintainable_asset`
- `replaceable_unit`
- `monitored_asset`
- `critical_asset`
- `cyber_managed_asset`
- `safety_related_asset`

Lifecycle roles are orthogonal to asset form and operational role. They MAY coexist with Equipment roles, Device roles, both, or neither.

#### 5.1.8 Asset identity structures

The Asset `identity` object SHOULD support:

- `source_references[]`
- `confidence`
- `identifier_assignments[]`

Each `identifier_assignment` SHOULD support:

- `assignment_id`
- `identifier_value`
- `identifier_role`
- `semantic_usage`
- `identifier_scope`
- `identifier_authority`
- `verification_status`
- `valid_from`
- `valid_to`
- `confidence`
- `provenance`

Governed identifier roles include:

- `canonical_ssom_id`
- `manufacturer_serial_number`
- `manufacturer_model_identifier`
- `engineering_tag`
- `asset_tag`
- `functional_location_reference`
- `eam_equipment_id`
- `cmdb_ci_id`
- `historian_tag`
- `opc_ua_node_id`
- `opc_ua_namespace_uri`
- `scada_object_id`
- `bms_object_id`
- `oem_cloud_id`
- `network_identity`
- `finance_asset_id`
- `maintenance_vendor_id`
- `digital_twin_id`

Functional-location references MAY appear as contextual identifier assignments, but the functional location itself SHOULD be modeled as a distinct semantic object or relationship target.

#### 5.1.9 Classification assertions and projections

SSOM uses `classification_assertions[]` as the authoritative classification-friendly structure when provenance, temporal validity, confidence, semantic-profile version, or derivation traceability must be preserved.

An `AssetClassificationAssertion` SHOULD be able to represent:

- `classification_scheme`
- `classification_category`
- `classification_code`
- `asserted_by`
- `source_reference`
- `valid_from`
- `valid_to`
- `confidence`
- `derivation_method`
- `semantic_profile_version`
- `provenance`

Simple consumer projections such as `asset_form`, `equipment_roles[]`, `device_roles[]`, `lifecycle_roles[]`, and `primary_operational_role` MAY be exposed for fast consumption, provided they remain compatible with the authoritative classification assertions.

`primary_operational_role` is OPTIONAL and MUST NOT be used to imply exclusivity.

#### 5.1.10 Non-exclusivity examples

- A centrifugal pump is normally Equipment.
- A pressure transmitter is normally a Device.
- A PLC is normally a Device and may also be a maintainable Asset.
- A VFD is frequently both Equipment and Device.
- A smart pump is both Equipment and Device.
- A robotic welding cell may be Equipment in a production hierarchy and Device in an OPC UA exposure or control context.
- A motor control center is Equipment as an electrical assembly and may contain many Device Assets.
- A cooling-water system is normally a System or Functional Segment that contains multiple Equipment and Device Assets, rather than being treated as a single serialized Asset by default.

### 5.2 Relationship

A **Relationship** is a typed, directed, time-bounded association between SSOM entities.

Required fields:

- `relationship_id`
- `relationship_type`
- `from_ref`
- `to_ref`
- `provenance`
- `confidence`

Relationship records SHOULD support, where applicable:

- subject and object references using `from_ref` and `to_ref`;
- `relationship_context`;
- `valid_from` and `valid_to`;
- `source_system`;
- `source_record`;
- `semantic_profile_version`;
- `direction`; and
- `cardinality`.

Core and normalized relationship semantics include:

- `contains`
- `located_in`
- `part_of`
- `is_part_of`
- `feeds`
- `depends_on`
- `controls`
- `monitors`
- `measures`
- `actuates`
- `protects`
- `communicates_with`
- `is_connected_to`
- `is_installed_on`
- `is_contained_in`
- `drives`
- `powered_by`
- `is_powered_by`
- `is_managed_by`
- `has_control_target`
- `has_measurement_target`
- `has_protection_target`
- `serves`
- `has_sensor`
- `replaces`
- `replaced_by`
- `succeeds`
- `preceded_by`
- `split_into`
- `merged_from`
- `decommissioned_as`
- `recommissioned_as`

Profiles MAY document aliases. For example, a source term such as `is_installed_in` SHOULD normalize to `is_installed_on` or `located_in` without losing the source assertion.

Relationship examples:

- Pressure Transmitter `PT-101` measures Pump `P-101` discharge pressure.
- PLC-17 controls VFD-12.
- VFD-12 actuates Motor M-101.
- Motor M-101 drives Pump P-101.
- Motor Protection Relay MPR-101 protects Motor M-101.
- Industrial Gateway GW-01 communicates_with PLC-17.
- Pump P-101 is_part_of Cooling Water System CW-01.
- Pump P-101 is_installed_on Functional Location Plant-2/Area-B/Unit-14.
- Pump P-101 replacement asset replaces Pump P-101 original while retaining the same engineering tag over a later validity period.
- Robot Cell RC-01 is classified as both `production_equipment` and `control_device` where the maintained evidence supports both roles.

### 5.3 Functional Location

A **Functional Location** is a distinct operational or engineering location context used for placement, maintenance context, and continuity reasoning.

A Functional Location is not the same thing as an Asset identity. Multiple Assets may occupy the same Functional Location over time, and a replacement Asset may inherit the same Functional Location without becoming the same Asset.

Required fields:

- `location_id`
- `display_name`
- `location_type`
- `ssom_version`

### 5.4 Identity Lifecycle Event

An **Identity Lifecycle Event** is a time-bound identity-affecting event such as commissioning, decommissioning, replacement, recommissioning, relocation, tag reassignment, merge, split, or source-system migration.

Required fields:

- `event_id`
- `event_type`
- `subject_refs`
- `effective_time`
- `provenance`
- `temporal_integrity`

### 5.5 Observation

An **Observation** is a time-indexed measurement or state value associated with an Asset or observable subject.

An Observation is not automatically a fact, governed conclusion, recommendation, decision, action, or outcome.

When an Observation carries structured measurement semantics, it MUST preserve original source measurement and canonical normalized measurement as distinct structures rather than overwriting the original source value.

Practical warning:

> A value is not operationally comparable merely because it is numeric.

Required fields:

- `record_id`
- `subject_ref`
- `metric`
- `value`
- `event_time`
- `quality`
- `provenance`
- `temporal_integrity`

#### 5.5.1 Structured measurement semantics

An Observation MAY additionally carry structured measurement semantics using the following machine-readable elements:

- `original_measurement`
- `canonical_measurement`
- `conversion_lineage`
- `measurement_quality`
- `calibration_context`
- `signal_context`
- `time_synchronization_context`

`original_measurement` preserves source-provided value, source-provided unit, source timestamp, source quality, and source representation.

`canonical_measurement` preserves normalized value, canonical unit, and explicit quantity kind.

`conversion_lineage` preserves the governed source unit, governed canonical unit, conversion method, conversion version, conversion actor or service, conversion timestamp, and formula reference where relevant.

`measurement_quality` preserves quality code, communication quality, validity, uncertainty where available, accuracy where available, precision where available, missing-data state, and stale-data state.

`calibration_context` preserves calibration reference, calibration status, last-known calibration date where available, next-due status where available, and sensor or instrument reference.

`signal_context` preserves measurement target, source Device or Instrument, engineering unit, display unit, engineering range, operational range, setpoint where relevant, alarm threshold where relevant, baseline where relevant, sampling interval, aggregation method, and operating mode context.

`time_synchronization_context` preserves source timestamp, ingestion timestamp, clock or time-source context where available, and ordering context for late-arriving or out-of-order data.

#### 5.5.2 Normative measurement-safety rules

1. Original source value and original source unit MUST be preservable separately from canonical normalized measurement.
2. Canonical normalized measurement MUST declare explicit quantity kind and canonical unit.
3. Unit conversion MUST be traceable through governed conversion lineage.
4. A value with missing, free-form, or unknown unit semantics MUST NOT be treated as safely comparable across sources.
5. Dimensional incompatibility between unit and quantity kind MUST be rejected or explicitly flagged by semantic validation.
6. Calibration status, stale-data state, missing-data state, and degraded communication quality MUST be representable in structured fields.
7. Measurement target context MUST remain explicit and MUST identify the observed Asset, Device, Signal, or equivalent operational target context.
8. Observation semantics MUST remain distinct from Condition, Event, Alarm, Inference, Recommendation, Decision, Action, and Outcome semantics.
9. No generic free-form field MAY become the primary carrier for quantity kind, unit meaning, conversion lineage, calibration status, or measurement quality semantics.
10. SSOM MUST NOT claim or require a new universal unit catalog. Implementations SHOULD use governed references to recognized unit or quantity vocabularies or approved source-specific code systems.

### 5.6 Semantic Truth and Decision Lifecycle

SSOM v0.4.0 defines a semantic truth and decision lifecycle so implementations can preserve source evidence, derived interpretation, future-oriented reasoning, proposed interventions, approvals, executed interventions, and assessed results without collapsing them into one ambiguous record type.

#### 5.4.1 Normative truth-state rules

1. An Observation MUST NOT be treated automatically as a fact or governed conclusion.
2. A Source Assertion MUST remain distinguishable from an Observation and MUST NOT be treated automatically as a governed conclusion.
3. A Derived Assertion MUST identify the evidence and derivation method that produced it.
4. An Inference MUST remain distinguishable from an Observation and a Source Assertion.
5. A Prediction MUST remain distinguishable from an Observation, Source Assertion, Derived Assertion, and Inference, and MUST NOT be treated automatically as a fact.
6. A Recommendation MUST remain distinguishable from a Decision and an Action.
7. A Decision MUST remain distinguishable from an Action.
8. A completed Action MUST NOT be treated automatically as a successful Outcome.
9. An Outcome MUST preserve the evidence used to assess the result.
10. Derived semantic objects MUST remain traceable to source evidence.
11. Contradictory source assertions MUST be preservable without forcing premature reconciliation.
12. Truth-state objects that may change over time SHOULD support validity periods, correction lineage, and supersession lineage without deleting original evidence.

Normative machine-readable artifacts for this lifecycle are:

- `schemas/jsonschema/observation.json`
- `schemas/jsonschema/source-assertion.json`
- `schemas/jsonschema/derived-assertion.json`
- `schemas/jsonschema/inference.json`
- `schemas/jsonschema/prediction.json`
- `schemas/jsonschema/recommendation.json`
- `schemas/jsonschema/decision.json`
- `schemas/jsonschema/action.json`
- `schemas/jsonschema/outcome.json`
- `schemas/jsonschema/common.json`

#### 5.4.2 Source Assertion

A **Source Assertion** is a statement attributed to a source system, person, device, or external model.

A Source Assertion MAY be true, false, stale, contradictory, or superseded. It MUST NOT be silently treated as a fact.

Required fields:

- `assertion_id`
- `assertion_type`
- `subject_ref`
- `asserted_value`
- `asserted_at`
- `assertion_state`
- `provenance`
- `temporal_integrity`

#### 5.4.3 Derived Assertion

A **Derived Assertion** is a governed statement calculated from one or more Observations, Source Assertions, Conditions, or documented transformations.

Required fields:

- `assertion_id`
- `assertion_type`
- `subject_ref`
- `asserted_value`
- `derived_at`
- `evidence_refs`
- `derivation_method`
- `confidence`
- `provenance`
- `temporal_integrity`

#### 5.4.4 Inference

An **Inference** is a reasoned interpretation derived from evidence.

Required fields:

- `inference_id`
- `inference_type`
- `subject_ref`
- `conclusion`
- `evidence_refs`
- `derivation_method`
- `confidence`
- `responsible_party`
- `inferred_at`
- `provenance`
- `temporal_integrity`

#### 5.4.5 Prediction

A **Prediction** is a future-oriented estimate, forecast, or probability statement.

Required fields:

- `prediction_id`
- `prediction_type`
- `subject_ref`
- `prediction_target`
- `predicted_value`
- `prediction_horizon`
- `predicted_at`
- `derivation_method`
- `confidence`
- `evidence_refs`
- `responsible_party`
- `provenance`
- `temporal_integrity`

#### 5.4.6 Recommendation

A **Recommendation** is a proposed intervention or action.

Required fields:

- `recommendation_id`
- `recommendation_type`
- `target_ref`
- `recommended_action`
- `rationale`
- `priority`
- `confidence`
- `evidence_refs`
- `expected_outcome`
- `recommended_at`
- `provenance`
- `temporal_integrity`

#### 5.4.7 Decision

A **Decision** is an approval, rejection, deferral, selection, or override made by an authorized human or governed automated process.

Required fields:

- `decision_id`
- `decision_type`
- `decision_status`
- `context_refs`
- `evidence_refs`
- `decision_time`
- either `decision_actor` or `decision_authority`
- `provenance`
- `temporal_integrity`

#### 5.4.8 Action

An **Action** is an executed operational intervention.

SSOM v0.4.0 defines only a generic Action foundation. Work execution, maintenance, inspection, notification, and control-action specializations remain profile scope.

Required fields:

- `action_id`
- `action_type`
- `target_ref`
- `action_status`
- `basis_refs`
- `executed_at`
- `provenance`
- `temporal_integrity`

#### 5.4.9 Outcome

An **Outcome** is a measured or assessed result following an Action, Decision, Event, or operational condition.

An Outcome MUST distinguish intended outcome from observed outcome.

Required fields:

- `outcome_id`
- `outcome_type`
- `subject_ref`
- `intended_outcome`
- `observed_outcome`
- `assessed_at`
- `evidence_refs`
- `confidence`
- at least one of `action_ref` or `decision_ref`
- `provenance`
- `temporal_integrity`

### 5.7 Reliability, Failure, and Work Lifecycle

SSOM v0.7.0 defines first-class reliability and maintenance semantics around the existing Recommendation, Decision, Action, and Outcome foundation.

The expected semantic chain is:

Observation or Event or Condition -> Diagnostic or Failure Hypothesis -> Recommendation -> Decision -> Work Request -> Work Plan -> Work Execution -> Work Verification -> Work Outcome -> Reliability or Availability or Operational Impact

#### 5.7.1 Normative reliability and work rules

1. A failure mode MUST remain distinguishable from a failure mechanism.
2. A failure mechanism MUST remain distinguishable from a failure cause.
3. A symptom MUST NOT be treated automatically as a diagnosis.
4. A work request MUST remain distinguishable from work execution.
5. A completed work execution MUST NOT be treated automatically as proof of restored function.
6. Work verification MUST identify the evidence used to validate or reject restoration.
7. A work outcome MUST preserve both intended outcome and observed outcome.
8. A recurring failure MUST be linkable to prior work and prior failure history.
9. Reliability claims MUST remain traceable to asset class, operating context, measurement evidence, work history, and outcome evidence.
10. ISO 14224-like terminology MAY be mapped to SSOM, but no compliance claim is implied without explicit supporting evidence.

#### 5.7.2 Symptom

A **Symptom** is a directly observed operational symptom such as abnormal vibration, visible leakage, abnormal temperature rise, or unstable control response.

Required fields:

- `symptom_id`
- `subject_ref`
- `symptom_type`
- `symptom_ref`
- `first_observed_at`
- `evidence_refs`
- `provenance`
- `temporal_integrity`

#### 5.7.3 Failure Mode

A **Failure Mode** is the way an asset or function fails, such as bearing degradation, seal leakage, or drive trip.

Required fields:

- `failure_mode_id`
- `subject_ref`
- `failure_mode_ref`
- `affected_function`
- `classified_at`
- `provenance`
- `temporal_integrity`

#### 5.7.4 Failure Mechanism

A **Failure Mechanism** is the physical or logical process that produces the failure mode, such as lubrication breakdown, erosion, capacitor degradation, corrosion, or configuration drift.

Required fields:

- `failure_mechanism_id`
- `subject_ref`
- `failure_mechanism_ref`
- `evidence_refs`
- `inferred_at`
- `confidence`
- `provenance`
- `temporal_integrity`

#### 5.7.5 Failure Cause

A **Failure Cause** is the attributed causal factor that explains why the failure mode or mechanism occurred.

Required fields:

- `failure_cause_id`
- `subject_ref`
- `failure_cause_ref`
- `evidence_refs`
- `determined_at`
- `confidence`
- `provenance`
- `temporal_integrity`

#### 5.7.6 Failure Event

A **Failure Event** is a time-bound loss or degradation event for an intended function.

Required fields:

- `failure_event_id`
- `subject_ref`
- `failure_mode_ref`
- `event_status`
- `occurred_at`
- `evidence_refs`
- `provenance`
- `temporal_integrity`

#### 5.7.7 Diagnostic

A **Diagnostic** is a reasoned diagnosis or failure hypothesis derived from evidence.

Required fields:

- `diagnostic_id`
- `subject_ref`
- `diagnostic_type`
- `diagnostic_status`
- `conclusion`
- `evidence_refs`
- `diagnosed_at`
- `confidence`
- `provenance`
- `temporal_integrity`

At least one structured diagnostic anchor such as symptom reference, failure-mode reference, failure-mechanism reference, or failure-cause reference MUST be present when those distinctions are known.

#### 5.7.8 Prognostic

A **Prognostic** is a future-oriented projection of degradation progression, remaining useful life, or near-term failure risk.

Required fields:

- `prognostic_id`
- `subject_ref`
- `prognostic_type`
- `forecast`
- `prediction_horizon`
- `evidence_refs`
- `predicted_at`
- `confidence`
- `responsible_party`
- `prognostic_status`
- `provenance`
- `temporal_integrity`

#### 5.7.9 Maintenance Strategy

A **Maintenance Strategy** is a governed maintenance intent such as corrective, preventive, predictive, condition-based, run-to-failure, or proof-test strategy.

Required fields:

- `strategy_id`
- `subject_ref`
- `strategy_type`
- `objective`
- `evidence_refs`
- `effective_from`
- `provenance`
- `temporal_integrity`

#### 5.7.10 Work Request

A **Work Request** is a governed request for work derived from evidence, recommendation, decision, or maintenance strategy context.

Required fields:

- `work_request_id`
- `subject_ref`
- `request_type`
- `request_status`
- `requested_action`
- `basis_refs`
- `requested_at`
- `provenance`
- `temporal_integrity`

#### 5.7.11 Work Plan

A **Work Plan** is a prepared plan for work execution including intended steps, parts, labor, interruption expectation, and verification approach.

Required fields:

- `work_plan_id`
- `subject_ref`
- `work_request_ref`
- `plan_status`
- `planned_actions`
- `planned_verification_method`
- `expected_outcome`
- `planned_start`
- `provenance`
- `temporal_integrity`

#### 5.7.12 Work Execution

A **Work Execution** is a specialization of Action for maintenance or repair work.

It reuses the generic Action semantics and adds work-specific context such as work request, work plan, parts used, labor participation, service interruption, and warranty coverage.

#### 5.7.13 Work Verification

A **Work Verification** is the post-work validation or rejection step that determines whether restoration evidence actually supports the intended claim.

Required fields:

- `verification_id`
- `subject_ref`
- `work_execution_ref`
- `verification_status`
- `verification_method`
- `restoration_status`
- `evidence_refs`
- `verified_at`
- `provenance`
- `temporal_integrity`

#### 5.7.14 Work Outcome

A **Work Outcome** is a specialization of Outcome for work results, including verification linkage, recurrence, and reliability or operational impact.

It reuses the generic Outcome semantics and adds work-specific verification references, outcome disposition, recurrence context, warranty context, and impact semantics.

Normative machine-readable artifacts for the reliability and work lifecycle are:

- `schemas/jsonschema/symptom.json`
- `schemas/jsonschema/failure-mode.json`
- `schemas/jsonschema/failure-mechanism.json`
- `schemas/jsonschema/failure-cause.json`
- `schemas/jsonschema/failure-event.json`
- `schemas/jsonschema/diagnostic.json`
- `schemas/jsonschema/prognostic.json`
- `schemas/jsonschema/maintenance-strategy.json`
- `schemas/jsonschema/work-request.json`
- `schemas/jsonschema/work-plan.json`
- `schemas/jsonschema/work-execution.json`
- `schemas/jsonschema/work-verification.json`
- `schemas/jsonschema/work-outcome.json`
- `schemas/jsonschema/recommendation.json`
- `schemas/jsonschema/decision.json`
- `schemas/jsonschema/action.json`
- `schemas/jsonschema/outcome.json`
- `schemas/jsonschema/common.json`

### 5.7 Event and Alarm planned profile scope

Event and Alarm labels remain reserved for future profile work. Implementations MAY use the Canonical Operational Record envelope to label records as `event` or `alarm`, but dedicated machine-readable Event and Alarm schemas are not normative in SSOM v0.4.0.

### 5.8 Condition

A **Condition** is a qualified operational finding derived from one or more SSOM observations, assertions, events, alarms, actions, outcomes, or authoritative source statements.

A Condition distinguishes actionable operational meaning from a raw observation or event.

Required fields:

- `condition_id`
- `condition_type`
- `subject_ref`
- `lifecycle_state`
- `severity`
- `confidence`
- `detected_at`
- `evidence_refs`
- `provenance`
- `quality_summary`

### 5.9 Operational Context

Operational Context carries references that help consumers understand a record in its operating environment.

Examples include site, location, line, zone, system, process role, operational criticality, maintenance context, and classification.

Operational Context MUST use references or declared extensions. It MUST NOT embed implementation-specific workflow, dashboard, user, billing, credential, or control-plane state.

### 5.10 Provenance

Provenance describes origin and interpretation context.

Required fields:

- `source_platform`
- `source_authority_id`
- `source_reference`
- `lineage_id`
- `ingest_time`
- `processing_time`

Optional fields include `source_message_identity`, `mapping_package_id`, `mapping_version`, and `adapter_version`.

### 5.11 Quality

Quality describes fitness for use.

Minimum fields:

- `status`: `good`, `uncertain`, `bad`, `estimated`, or `missing`
- `validation_status`
- `reasons` when relevant

Quality MAY include normalized score, source quality, mapping confidence, and identity confidence.

### 5.12 Temporal Integrity

Temporal Integrity distinguishes:

- `event_time`
- `source_time`
- `receive_time`
- `processing_time`
- `time_confidence`
- `ordering_scope`
- `delivery_classification`

Core delivery classifications are `live`, `retained_snapshot`, `replay`, `backfill`, `late_arrival`, `reconstructed`, and `manual_entry`.

### 5.13 Policy Evidence

Policy Evidence is optional metadata that records classification, retention, purpose, or eligibility context.

It MUST NOT contain credentials, private policy rules, internal authorization logic, or user-specific application data.

## 6. Canonical Operational Record profile

A **Canonical Operational Record (COR)** is an implementation profile that packages one SSOM core object with the provenance, quality, temporal integrity, and policy context necessary for robust interchange.

The COR is not a separate competing semantic object. It is a practical interchange envelope.

Where dedicated truth-state or identity-lifecycle schemas exist, `record_type` MUST align with the packaged semantic object. Event and Alarm remain reserved COR labels until dedicated schemas are published.

```json
{
  "record_id": "urn:ssom:record:01J...",
  "record_type": "observation",
  "ssom_version": "0.5.0",
  "subject_ref": "urn:ssom:asset:...",
  "event_time": "2026-06-25T18:31:00Z",
  "priority_class": "P2",
  "payload": {},
  "provenance": {},
  "quality": {},
  "temporal_integrity": {},
  "policy_evidence": {}
}
```

## 7. Extensions and profiles

### 7.1 Extension namespace

Extensions MUST be namespaced:

```text
urn:ssom:ext:<organization-or-community>:<domain>:<name>
```

### 7.2 Extension rules

- Extensions MUST NOT change core-field meaning.
- Extensions MUST declare owner, version, compatibility, and documentation.
- Extensions SHOULD include fixtures and conformance tests.
- Vendor-specific content MAY be retained in provenance, source-specific classification assertions, or extension blocks while core objects remain vendor-neutral.

### 7.3 Profiles

SSOM v0.5.0 defines:

1. Core Asset and Relationship Profile
2. Asset Identity and Continuity Profile
3. Asset Classification Profile
4. Observation Profile
5. Semantic Truth and Decision Lifecycle Profile
6. Quality, Provenance, and Temporal Integrity Profile
7. Condition Profile
8. Analytical Warehouse Profile

An Event and Alarm profile remains planned profile scope until dedicated schemas are published.

An implementation MAY support a subset but MUST declare supported profiles.

## 8. Serialization and schema strategy

SSOM v0.5.0 adopts **JSON Schema** as the normative machine-readable schema for API and event interchange.

JSON Schema is selected because it supports broad API, cloud, event, and validation tooling.

XML Schema artifacts MAY be retained for compatibility. In this repository, the JSON Schemas are normative for v0.5.0. Placeholder XML artifacts remain informative until a compatibility update is published.

## 9. Compatibility and versioning

- SSOM uses semantic versioning.
- Removing a core field or changing its semantic meaning requires a major version.
- Additive optional fields are minor-version changes.
- Implementations MUST include `ssom_version`.
- Consumers MUST reject or quarantine unsupported major versions.
- Consumers SHOULD preserve unknown extension fields where safe.
- SSOM v0.5.0 is an additive, backward-compatible extension of the v0.4.0 draft.

## 10. Conformance

An SSOM v0.5.0 implementation MUST:

1. Validate claimed profiles against normative JSON Schemas.
2. Preserve identity, provenance, quality, and temporal information.
3. Declare supported profiles and extensions.
4. Preserve source reference and source authority.
5. Distinguish live, retained, replay, backfill, late, reconstructed, and manual records where known.
6. Keep implementation-private application data outside SSOM core semantics.
7. Provide fixtures and test results for claimed profiles.
8. Document version compatibility.
9. Preserve enough lineage to explain semantic transformation.
10. Follow extension namespace rules.
11. Permit an Asset to carry Equipment roles, Device roles, both, or neither.
12. Preserve source-specific type assertions or metadata when mapping source types into SSOM role classifications.
13. Avoid treating Equipment and Device as disjoint inheritance classes in schemas, profiles, or consumers.
14. Distinguish Observation, Source Assertion, Derived Assertion, Inference, Prediction, Recommendation, Decision, Action, and Outcome records.
15. Preserve contradictory source assertions without forcing premature reconciliation.
16. Preserve evidence references for Derived Assertion, Inference, Prediction, Recommendation, Decision, and Outcome records.
17. Preserve correction or supersession lineage where a truth-state record is updated or replaced.
18. Preserve canonical Asset identity separately from external identifier assignments.
19. Preserve identifier scope, authority, provenance, confidence, verification status, and validity periods where identifier continuity matters.
20. Allow replacement, recommission, split, merge, and source-system migration scenarios without reusing canonical Asset IDs.
21. Distinguish Functional Location from Asset identity.

## 11. Security and privacy considerations

Operational records can expose sensitive facility, topology, production, equipment, and device information.

Implementations SHOULD minimize sensitive content, keep credentials outside semantic records, apply purpose and retention metadata, protect source references that reveal proprietary topology, control access to high-resolution telemetry and media references, avoid placing private application authorization logic inside SSOM, and support deletion or tombstone references where required.

## 12. Migration from v0.4

Implementations moving from v0.4.0 to v0.5.0 SHOULD:

1. retain existing Assets, Relationships, Observations, Conditions, and truth-state records without re-identifying them;
2. preserve existing source references while adding governed `identifier_assignments[]` where identity continuity matters;
3. treat engineering tags, historian paths, CMDB CI numbers, and OPC UA node IDs as time-bound assignments rather than globally immutable identities;
4. model functional location as a distinct relationship target or object, not as canonical Asset identity;
5. emit identity lifecycle events for replacement, recommission, split, merge, relocation, or source-system migration scenarios when those distinctions matter;
6. keep application-private state out of the standard; and
7. avoid implying that identifier reuse over time means canonical Asset reuse.

## 13. Open questions

- Alignment with OPC UA companion specifications and Asset Administration Shell mappings
- Community governance and extension registry process
- Relationship vocabulary expansion
- Condition taxonomy governance
- Identity bundle interchange profile for multi-record validation beyond schema structure
- Canonical unit and quantity-kind alignment
- Protobuf and Avro bindings
- Privacy-preserving benchmark profile
- Public conformance automation and certification registry
