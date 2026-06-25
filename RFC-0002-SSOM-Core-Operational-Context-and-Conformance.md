# RFC-0002: SSOM Core, Operational Context, and Conformance

- **Status:** Draft
- **Category:** Standards Track
- **Intended Version:** SSOM v0.2
- **Created:** 2026-06
- **Updates:** RFC-0001
- **License:** Apache-2.0

## Abstract

This RFC evolves the Standardized Semantic Object Model (SSOM) from an initial conceptual model into an implementable, vendor-neutral semantic standard for operational technology and industrial operations data.

SSOM defines portable semantics for operational facts. It does not define a workflow engine, SaaS administration model, dashboard system, cloud architecture, source-platform product model, or vendor-specific implementation.

This RFC adds the minimum semantic concepts required for implementers to create, exchange, validate, analyze, and explain operational records across systems:

- Asset identity and identity confidence
- Asset relationships and topology
- Observations and telemetry
- Events and alarms
- Conditions
- Operational context
- Temporal integrity
- Quality
- Provenance and lineage
- Source authority
- Policy evidence
- Extension, compatibility, and conformance rules

## 1. Motivation

Operational systems commonly produce records that are difficult to combine across platforms because the record alone does not explain:

- What entity or asset it refers to
- Which source system supplied it
- Whether it is live, replayed, retained, backfilled, late, or reconstructed
- Whether its timestamp, quality, and identity are reliable
- Which transformation or mapping created the semantic representation
- Which related assets, locations, or systems provide context
- Whether an operational finding is merely a signal or a meaningful condition

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
- a required data store, event bus, cloud provider, or deployment topology;
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

An **Asset** is a physical, logical, virtual, or organizational entity participating in an operational process.

Examples include a pump, robot, chiller, building, electrical feeder, production line, vehicle, camera, process unit, or control system.

An Asset MUST include:
- `asset_id`
- `asset_type`
- `display_name`
- `lifecycle_state`
- `identity`
- `ssom_version`

An Asset MAY include:
- manufacturer/model
- serial number
- functional role
- operational criticality
- spatial reference
- domain extensions
- context references

### 5.2 Relationship

A **Relationship** is a typed, directed, time-bounded association between SSOM entities.

Required fields:
- `relationship_id`
- `relationship_type`
- `from_ref`
- `to_ref`
- `provenance`
- `confidence`

Common relationship types include:
- `contains`
- `located_in`
- `part_of`
- `feeds`
- `depends_on`
- `controls`
- `monitors`
- `communicates_with`
- `powered_by`
- `serves`
- `has_sensor`

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

An Alarm MAY include:
- source alarm identifier
- alarm state
- acknowledgement state
- priority
- rule or limit reference
- suppression or maintenance context

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

A Condition MAY include:
- affected entities
- correlation key
- recurrence context
- suppression context
- maintenance context
- recommended action class
- resolution evidence

### 5.7 Operational Context

Operational Context carries references that help consumers understand a record in its operating environment.

Examples:
- site
- location
- line
- zone
- system
- process role
- operational criticality
- maintenance context
- classification

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

Optional fields:
- `source_message_identity`
- `mapping_package_id`
- `mapping_version`
- `adapter_version`

### 5.9 Quality

Quality describes fitness for use.

Minimum fields:
- `status`: `good`, `uncertain`, `bad`, `estimated`, or `missing`
- `validation_status`
- `reasons` when relevant

Quality MAY include:
- normalized score
- source quality
- mapping confidence
- identity confidence

### 5.10 Temporal Integrity

Temporal Integrity distinguishes:
- `event_time`
- `source_time`
- `receive_time`
- `processing_time`
- `time_confidence`
- `ordering_scope`
- `delivery_classification`

Core delivery classifications:
- `live`
- `retained_snapshot`
- `replay`
- `backfill`
- `late_arrival`
- `reconstructed`
- `manual_entry`

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
  "ssom_version": "0.2",
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

Examples:
- `urn:ssom:ext:energy:power-quality:voltage-sag`
- `urn:ssom:ext:manufacturing:quality:defect-class`
- `urn:ssom:ext:logistics:fleet:mission-delay`

### 7.2 Extension rules

- Extensions MUST NOT change core-field meaning.
- Extensions MUST declare owner, version, compatibility, and documentation.
- Extensions SHOULD include fixtures and conformance tests.
- Vendor-specific content MAY be retained in provenance or extension blocks while core objects remain vendor-neutral.

### 7.3 Profiles

SSOM v0.2 defines:

1. Core Asset and Relationship Profile
2. Observation/Event/Alarm Profile
3. Quality, Provenance, and Temporal Integrity Profile
4. Condition Profile
5. Analytical Warehouse Profile

An implementation MAY support a subset but MUST declare supported profiles.

## 8. Serialization and schema strategy

SSOM v0.2 adopts **JSON Schema** as the normative machine-readable schema for API and event interchange.

JSON Schema is selected because it supports broad API, cloud, event, and validation tooling.

XML Schema artifacts MAY be retained for compatibility. Protobuf and Avro bindings MAY be supplied for performance-oriented paths, provided they preserve the same semantic field meanings and compatibility rules.

## 9. Compatibility and versioning

- SSOM uses semantic versioning.
- Removing a core field or changing its semantic meaning requires a major version.
- Additive optional fields are minor-version changes.
- Implementations MUST include `ssom_version`.
- Consumers MUST reject or quarantine unsupported major versions.
- Consumers SHOULD preserve unknown extension fields where safe.

## 10. Conformance

An SSOM v0.2 implementation MUST:

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

## 11. Security and privacy considerations

Operational records can expose sensitive facility, topology, production, or equipment information.

Implementations SHOULD:
- minimize sensitive content;
- keep credentials outside semantic records;
- apply purpose and retention metadata;
- protect source references that reveal proprietary topology;
- control access to high-resolution telemetry and media references;
- avoid placing private application authorization logic inside SSOM;
- support deletion or tombstone references where required.

## 12. Migration from RFC-0001

Implementations moving to v0.2 SHOULD:
1. retain the conceptual Asset, Telemetry Event, and Relationship foundation;
2. add machine-readable JSON Schemas;
3. add Provenance, Quality, Temporal Integrity, and Source Authority;
4. add Condition as a first-class object;
5. publish compatibility and migration guidance;
6. keep application-private state out of the standard.

## 13. Open questions

- Alignment with OPC UA companion specifications and Asset Administration Shell mappings
- Community governance and extension registry process
- Relationship vocabulary expansion
- Condition taxonomy governance
- Canonical unit and quantity-kind alignment
- Protobuf and Avro bindings
- Privacy-preserving benchmark profile
- Public conformance automation and certification registry
