# SSOM v0.3 Standards Mapping Note

This note describes how SSOM v0.3.0 is aligned with, maps to, or supports interoperability with existing industrial standards. It does not claim formal certification or standards-body endorsement.

## Mapping summary

| Standards Area | SSOM Relevance |
| --- | --- |
| ISA-95 / IEC 62264 | Equipment hierarchy, production and operations context, process and control structures |
| MIMOSA / CCOM / OSA-EAI | Asset lifecycle, condition, maintenance, reliability, and asset registry semantics |
| OPC UA | Device identity, interfaces, measurements, alarms, events, historical data, and control semantics |
| The Open Group O-PAS | Open, secure, interoperable process-automation principles and supplier-neutral architectures |
| ISO 14224 | Equipment taxonomy, failure, maintenance, reliability, and comparable performance semantics |
| ISO 55000 | Lifecycle value, asset management, criticality, risk, and operational consequence |
| IEC 81346 | Engineering reference designations and industrial system structure |
| UCUM-compatible or governed unit vocabularies | Stable unit identifiers and unit-code mapping discipline for measurement exchange |

## Detailed notes

- Equipment classifications align most naturally with ISA-95 operational hierarchies, MIMOSA asset lifecycle concepts, ISO 14224 reliability concepts, and ISO 55000 asset-management principles.
- Device classifications align most naturally with OPC UA information-model, telemetry, control, diagnostic, interface, and cybersecurity contexts.
- Identity lifecycle semantics align with MIMOSA-style lifecycle continuity, ISA-95 location and equipment distinctions, OPC UA node and namespace change handling, and IEC 81346-style structural context.
- Measurement-safety semantics are designed to map to governed quantity and unit references, including UCUM-compatible unit codes or approved source-specific unit vocabularies, without claiming a new universal unit system.
- SSOM serves as the semantic bridge between equipment, devices, systems, process context, evidence, condition, work, and operational outcome.
- SSOM asset forms and classification assertions are designed to preserve relevant semantics from engineering, operations, maintenance, and cybersecurity sources without collapsing them into a single source-specific taxonomy.

## Qualified alignment statements

- SSOM is **aligned with** ISA-95 and IEC 62264 where implementations need to distinguish functional systems, production structures, and equipment context.
- SSOM **maps to** MIMOSA-style lifecycle, maintenance, and condition-management semantics through Asset identity, relationships, observations, and conditions.
- SSOM **supports interoperability with** OPC UA by preserving device-oriented identity, interface, telemetry, diagnostics, control semantics, and node or namespace identity change over time.
- SSOM **supports governed measurement interoperability with** OPC UA, historian, and telemetry ecosystems by preserving source unit, canonical unit, quantity kind, conversion lineage, signal context, and late-arrival timing context.
- SSOM is **designed to preserve relevant semantics from** O-PAS-oriented open and interoperable automation architectures without prescribing a control-system product model.
- SSOM is **aligned with** ISO 14224 and ISO 55000 concepts when representing reliability, failure, maintenance, criticality, consequence, and lifecycle context.
- SSOM **maps to** IEC 81346 style structural and designation reasoning by keeping system, functional location, and Asset relationships explicit instead of conflating them.
- SSOM **is designed to reference** governed unit vocabularies such as UCUM-compatible code systems when implementations need stable unit identifiers, but it does not claim formal conformance to any external unit catalog.