# RFC-0001: Standardized Semantic Object Model (SSOM)

**Status:** Draft  
**Category:** Standards Track  
**Created:** 2026-01  
**Authors:** Last Mile Engineering Group  

---

## Abstract

This RFC defines the Standardized Semantic Object Model (SSOM), an open, AI-native semantic standard for operational technology (OT) data. SSOM establishes canonical representations for assets, telemetry, and relationships to enable interoperable analytics, machine learning, and autonomous systems across industrial environments.

---

## 1. Motivation

Operational technology data is fragmented, vendor-specific, and semantically inconsistent. While transport protocols are mature, the lack of shared meaning prevents scalable analytics and AI.

SSOM addresses this gap by defining a common semantic layer independent of vendors, industries, or control systems.

---

## 2. Design Principles

SSOM adheres to the following principles:

- Vendor neutrality
- Global asset identity
- Semantic-first modeling
- Explicit relationships
- Temporal and spatial integrity
- AI-native structure
- Extensibility without mutation

---

## 3. Core Concepts

### 3.1 Asset

Any physical or logical entity participating in an operational process.

### 3.2 Telemetry Event

A time-indexed observation emitted by an asset with defined meaning and units.

### 3.3 Relationship

A defined dependency or interaction between assets.

---

## 4. Core Object Model (Normative)

### 4.1 Asset Identity Object

Every asset SHALL have a globally unique SSOM UUID.

<SSOMAsset>
  <Identity>
    <SSOMUUID>urn:ssom:asset:GLOBAL-UUID</SSOMUUID>
    <AssetClass>RotaryActuator</AssetClass>
    <Industry>Manufacturing</Industry>
  </Identity>
</SSOMAsset>

---

### 4.2 Telemetry Event Object

<SSOMTelemetryEvent>
  <Source ref=""urn:ssom:asset:GLOBAL-UUID""/>
  <TimestampUTC>2026-01-01T12:00:00Z</TimestampUTC>
  <Metric>
    <Name>BearingVibration</Name>
    <Value uom=""mm/s"">4.2</Value>
    <HealthState>Warning</HealthState>
  </Metric>
</SSOMTelemetryEvent>

---

### 4.3 Relationship Object

<SSOMRelationship>
  <Parent ref=""urn:ssom:asset:UPSTREAM""/>
  <Child ref=""urn:ssom:asset:DOWNSTREAM""/>
  <Type>Feeds</Type>
</SSOMRelationship>

---

## 5. Domain Extensions

Domain extensions MAY add attributes but SHALL NOT modify core semantics.

---

## 6. Reference Implementation (Informative)

SSOM includes a reference implementation optimized for Google BigQuery to demonstrate analytics-scale deployment.

---

## 7. Conformance

Conformance requirements are indexed in `conformance/checklist.md`, with the current release-surface authority defined by the versioned checklist for the active semantic family. For the present audited repository state, the authoritative release checklist is `conformance/checklist-v1.0.md`.

---

## 8. Open Questions

- Governance model evolution
- Industry-specific extension libraries
- Alignment with existing standards bodies

---

## 9. Call for Feedback

This RFC is open for public review. Feedback is encouraged via GitHub issues.
