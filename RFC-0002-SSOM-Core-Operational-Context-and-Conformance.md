# RFC-0002: SSOM Core, Operational Context, and Conformance

- **Status:** Draft
- **Category:** Standards Track
- **Intended Version:** SSOM v0.3.0
- **Created:** 2026-06
- **Updates:** RFC-0001
- **License:** Apache-2.0

## Abstract

This RFC evolves the Standardized Semantic Object Model (SSOM) from an initial conceptual model into an implementable, vendor-neutral semantic standard for operational technology and industrial operations data.

SSOM defines portable semantics for operational facts. It does not define a workflow engine, SaaS administration model, dashboard system, cloud architecture, source-platform product model, or vendor-specific implementation.

SSOM v0.3.0 adds a formally governed way to distinguish **Equipment** and **Device** as overlapping operational classifications of an **Asset** while preserving Asset as the canonical lifecycle identity.

## 1. Motivation

Operational systems commonly produce records that are difficult to combine across platforms because the record alone does not explain:

- what entity or asset it refers to;
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
2. Relationship
3. Observation
4. Event
5. Alarm
6. Condition
7. Operational Context
8. Provenance
9. Quality
10. Temporal Integrity
11. Policy Evidence
12. Extension and conformance metadata

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

- semantic operational facts;
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

#### 5.1.1 Normative asset-classification rules

1. An Asset MUST remain the canonical identity for lifecycle, provenance, relationships, condition, work history, and outcomes.
2. Equipment and Device MUST NOT be modeled as mutually exclusive inheritance branches.
3. An Asset MAY carry one or more Equipment roles and one or more Device roles at the same time.
4. Equipment and Device classifications SHOULD preserve source, provenance, effective period, confidence, and semantic-profile information where the existing SSOM model supports those concepts.
5. Where a source system exposes a vendor-specific type, SSOM SHOULD preserve the source type and map it to SSOM classifications without discarding the source assertion.
6. The model MUST permit a smart or connected operational asset, such as a VFD, CNC, robot, smart valve, smart pump, packaged chiller, or control skid, to be represented as both Equipment and Device.
7. The model MUST distinguish a functional system or process segment from a physical Asset instance unless the system itself is explicitly managed as an Asset.
8. The model SHOULD allow Equipment and Device classifications to be derived from source-system data, but derived classifications MUST remain traceable to their source or derivation logic.

#### 5.1.2 Asset forms

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

#### 5.1.3 Equipment roles

Equipment is an Asset classification representing an entity whose primary role is to perform, support, enable, contain, transport, transform, regulate, or otherwise contribute directly to a process, production, utility, facility, or material-handling function.

Core `equipment_roles[]` values are:

- `process_equipment`
- `utility_equipment`
- `material_handling_equipment`
- `facility_equipment`
- `production_equipment`

Equipment classifications commonly support operational concepts such as functional purpose, process role, maintainability, reliability, availability, criticality, performance, capacity, operating envelope, failure modes, maintenance strategy, work history, production impact, safety impact, and energy impact.

Examples include pumps, compressors, chillers, boilers, turbines, conveyors, packaging machines, production skids, robot cells, reactor vessels, air-handling units, motor control centers, electrical switchgear, production lines, and water-treatment systems.

#### 5.1.4 Device roles

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

#### 5.1.5 Lifecycle roles

Core `lifecycle_roles[]` values are:

- `serialized_asset`
- `maintainable_asset`
- `replaceable_unit`
- `monitored_asset`
- `critical_asset`
- `cyber_managed_asset`
- `safety_related_asset`

Lifecycle roles are orthogonal to asset form and operational role. They MAY coexist with Equipment roles, Device roles, both, or neither.

#### 5.1.6 Classification assertions and projections

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

#### 5.1.7 Non-exclusivity examples

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
- Robot Cell RC-01 is classified as both `production_equipment` and `control_device` where the maintained evidence supports both roles.

### 5.3 Observation

An **Observation** is a time-indexed measurement or state value associated with an Asset or observable subject.

Required fields:

- `record_id`
- `subject_ref`
- `metric`
- `value`
- `event_time`
- `quality`
- `provenance`
- `temporal_integrity`

### 5.4 Event

An **Event** is a discrete occurrence reported by a source system or inferred through a documented transformation.

Required fields:

- `record_id`
- `event_type`
- `subject_ref`
- `event_time`
- `provenance`
- `quality`
- `temporal_integrity`

### 5.5 Alarm

An **Alarm** is an Event representing an abnormal, warning, fault, or critical state.

An Alarm MAY include source alarm identifier, alarm state, acknowledgement state, priority, rule or limit reference, and suppression or maintenance context.

### 5.6 Condition

A **Condition** is a qualified operational finding derived from one or more SSOM facts or supplied by an authoritative source.

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

### 5.7 Operational Context

Operational Context carries references that help consumers understand a record in its operating environment.

Examples include site, location, line, zone, system, process role, operational criticality, maintenance context, and classification.

Operational Context MUST use references or declared extensions. It MUST NOT embed implementation-specific workflow, dashboard, user, billing, credential, or control-plane state.

### 5.8 Provenance

Provenance describes origin and interpretation context.

Required fields:

- `source_platform`
- `source_authority_id`
- `source_reference`
- `lineage_id`
- `ingest_time`
- `processing_time`

Optional fields include `source_message_identity`, `mapping_package_id`, `mapping_version`, and `adapter_version`.

### 5.9 Quality

Quality describes fitness for use.

Minimum fields:

- `status`: `good`, `uncertain`, `bad`, `estimated`, or `missing`
- `validation_status`
- `reasons` when relevant

Quality MAY include normalized score, source quality, mapping confidence, and identity confidence.

### 5.10 Temporal Integrity

Temporal Integrity distinguishes:

- `event_time`
- `source_time`
- `receive_time`
- `processing_time`
- `time_confidence`
- `ordering_scope`
- `delivery_classification`

Core delivery classifications are `live`, `retained_snapshot`, `replay`, `backfill`, `late_arrival`, `reconstructed`, and `manual_entry`.

### 5.11 Policy Evidence

Policy Evidence is optional metadata that records classification, retention, purpose, or eligibility context.

It MUST NOT contain credentials, private policy rules, internal authorization logic, or user-specific application data.

## 6. Canonical Operational Record profile

A **Canonical Operational Record (COR)** is an implementation profile that packages one SSOM core object with the provenance, quality, temporal integrity, and policy context necessary for robust interchange.

The COR is not a separate competing semantic object. It is a practical interchange envelope.

```json
{
  "record_id": "urn:ssom:record:01J...",
  "record_type": "observation",
  "ssom_version": "0.3.0",
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

SSOM v0.3.0 defines:

1. Core Asset and Relationship Profile
2. Asset Classification Profile
3. Observation/Event/Alarm Profile
4. Quality, Provenance, and Temporal Integrity Profile
5. Condition Profile
6. Analytical Warehouse Profile

An implementation MAY support a subset but MUST declare supported profiles.

## 8. Serialization and schema strategy

SSOM v0.3.0 adopts **JSON Schema** as the normative machine-readable schema for API and event interchange.

JSON Schema is selected because it supports broad API, cloud, event, and validation tooling.

XML Schema artifacts MAY be retained for compatibility. In this repository, the JSON Schemas are normative for v0.3.0. Placeholder XML artifacts remain informative until a compatibility update is published.

## 9. Compatibility and versioning

- SSOM uses semantic versioning.
- Removing a core field or changing its semantic meaning requires a major version.
- Additive optional fields are minor-version changes.
- Implementations MUST include `ssom_version`.
- Consumers MUST reject or quarantine unsupported major versions.
- Consumers SHOULD preserve unknown extension fields where safe.
- SSOM v0.3.0 is an additive, backward-compatible extension of the v0.2 draft.

## 10. Conformance

An SSOM v0.3.0 implementation MUST:

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

## 11. Security and privacy considerations

Operational records can expose sensitive facility, topology, production, equipment, and device information.

Implementations SHOULD minimize sensitive content, keep credentials outside semantic records, apply purpose and retention metadata, protect source references that reveal proprietary topology, control access to high-resolution telemetry and media references, avoid placing private application authorization logic inside SSOM, and support deletion or tombstone references where required.

## 12. Migration from v0.2

Implementations moving from v0.2 to v0.3.0 SHOULD:

1. retain the conceptual Asset, Telemetry Event, and Relationship foundation;
2. retain existing Assets without re-identifying them;
3. add `asset_form`, `equipment_roles[]`, `device_roles[]`, `lifecycle_roles[]`, and `classification_assertions[]` where evidence supports them;
4. preserve source-specific types as source assertions or source metadata;
5. avoid assuming Equipment and Device are mutually exclusive;
6. keep application-private state out of the standard; and
7. add semantic validation rules that prevent consumers from treating Equipment and Device as disjoint categories.

## 13. Open questions

- Alignment with OPC UA companion specifications and Asset Administration Shell mappings
- Community governance and extension registry process
- Relationship vocabulary expansion
- Condition taxonomy governance
- Canonical unit and quantity-kind alignment
- Protobuf and Avro bindings
- Privacy-preserving benchmark profile
- Public conformance automation and certification registry
