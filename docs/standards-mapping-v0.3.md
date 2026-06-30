# SSOM v0.3 Standards Mapping Note

This note describes how SSOM v0.3.0 is conceptually aligned with and designed to preserve semantics relevant to existing industrial standards. It does not claim formal certification, complete interoperability, or standards-body endorsement.

## Mapping summary

| Standards Area | SSOM Relevance |
| --- | --- |
| ISA-95 / IEC 62264 | Equipment hierarchy, production and operations context, process and control structures |
| MIMOSA / CCOM / OSA-EAI | Asset lifecycle, condition, maintenance, reliability, and asset registry semantics |
| OPC UA | Device identity, interfaces, measurements, alarms, events, historical data, and control semantics |
| ISA-18.2 / IEC 62682 | Alarm philosophy, alarm lifecycle, suppression or shelving discipline, and operator attention semantics |
| The Open Group O-PAS | Open, secure, interoperable process-automation principles and supplier-neutral architectures |
| ISO 14224 | Equipment taxonomy, failure, maintenance, reliability, and comparable performance semantics |
| ISO 55000 | Lifecycle value, asset management, criticality, risk, and operational consequence |
| IEC 81346 | Engineering reference designations and industrial system structure |
| UCUM-compatible or governed unit vocabularies | Stable unit identifiers and unit-code mapping discipline for measurement exchange |

## Detailed notes

- Equipment classifications align most naturally with ISA-95 operational hierarchies, MIMOSA asset lifecycle concepts, ISO 14224 reliability concepts, and ISO 55000 asset-management principles at the concept level.
- Device classifications align most naturally with OPC UA information-model, telemetry, control, diagnostic, interface, and cybersecurity contexts at the concept level.
- Identity lifecycle semantics are designed to preserve semantics relevant to MIMOSA-style lifecycle continuity, ISA-95 location and equipment distinctions, OPC UA node and namespace change handling, and IEC 81346-style structural context.
- Measurement-safety semantics are designed to preserve governed quantity and unit references, including UCUM-compatible unit codes or approved source-specific unit vocabularies, without claiming a new universal unit system or universal cross-vendor conversion catalog.
- Reliability and work semantics are designed to support ISO 14224-like terminology for failure mode, failure mechanism, failure cause, maintenance activity, and outcome tracking when the implementation supplies explicit mappings and evidence.
- Event, alarm, and state-transition semantics are designed to preserve alarm-management-relevant state, acknowledgment, suppression, shelving, clearance, and associated evidence without claiming conformance to an external alarm-management program by default.
- SSOM serves as the semantic bridge between equipment, devices, systems, process context, evidence, condition, work, and operational outcome.
- SSOM asset forms and classification assertions are designed to preserve relevant semantics from engineering, operations, maintenance, and cybersecurity sources without collapsing them into a single source-specific taxonomy.

## Qualified alignment statements

- SSOM is **conceptually aligned with** ISA-95 and IEC 62264 where implementations need to distinguish functional systems, production structures, and equipment context.
- SSOM **is designed to preserve semantics comparable to** MIMOSA-style lifecycle, maintenance, and condition-management models through Asset identity, relationships, observations, and conditions.
- SSOM **supports MIMOSA-like maintenance and work-history representation** through maintenance strategy, work request, work execution, verification, and work outcome semantics, but it does not claim direct MIMOSA conformance or complete interchange from this repository alone.
- SSOM **is designed to preserve device-oriented semantics relevant to** OPC UA by keeping identity, interface, telemetry, diagnostics, control semantics, and node or namespace identity change over time explicit.
- SSOM **supports governed measurement interoperability preparation for** OPC UA, historian, and telemetry ecosystems by preserving source unit, canonical unit, quantity kind, conversion lineage, signal context, and late-arrival timing context.
- SSOM **supports qualified alarm-management alignment with** ISA-18.2 and IEC 62682 style programs through typed Alarm and State Transition semantics, but it does not claim alarm rationalization, philosophy governance, or lifecycle compliance from schema support alone.
- SSOM is **designed to preserve relevant semantics from** O-PAS-oriented open and interoperable automation architectures without prescribing a control-system product model.
- SSOM **is designed to map to ISO 14224-like terminology** for reliability, failure, maintenance, and consequence semantics when the implementation provides explicit mapping evidence. It does not claim ISO 14224 compliance by default.
- SSOM is **conceptually aligned with** ISO 55000 concepts when representing lifecycle value, criticality, consequence, and operational asset-management context.
- SSOM **is designed to preserve semantics relevant to** IEC 81346 style structural and designation reasoning by keeping system, functional location, and Asset relationships explicit instead of conflating them.
- SSOM **is designed to reference** governed unit vocabularies such as UCUM-compatible code systems when implementations need stable unit identifiers, but it does not claim formal conformance to any external unit catalog.

## Claim boundary

- This repository demonstrates schema-level and fixture-backed semantic preservation. It does not by itself prove standards-certified exchange behavior, full companion-spec interoperability, or profile-complete crosswalks.
- Formal interoperability claims require implementation-specific mappings, profile constraints, source vocabulary governance, and executable evidence beyond the core repository fixtures.