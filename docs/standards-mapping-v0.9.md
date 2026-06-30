# SSOM Standards Crosswalks v0.9

This document replaces narrative-only standards alignment with traceable, field-level, qualified interoperability mappings.

SSOM is an AI-native semantic bridge designed to align with and preserve relevant semantics from established OT interoperability, lifecycle, and operations standards.

## Primary-source discipline

The structured artifacts introduced here reference official or primary-source standards body pages only. They are intended to show where SSOM maps to, preserves, extends, requires transformation for, or does not yet fully represent external concepts.

## Structured artifacts

- Crosswalk matrix: `docs/standards-crosswalk-matrix-v0.9.json`
- Source-system mapping guidance: `docs/source-system-mapping-guidance-v0.9.json`
- Transformation-loss register: `docs/transformation-loss-register-v0.9.json`
- Profile applicability matrix: `docs/profile-applicability-matrix-v0.9.json`
- Standards claims matrix: `docs/standards-claims-matrix-v0.9.json`
- Validation schema: `schemas/jsonschema/standards-mapping-artifact.json`
- Validation harness: `conformance/validate-schemas.mjs`

## Coverage highlights

- OPC UA NodeId and NamespaceUri map to scoped SSOM external identifier assignments backed by the OPC UA migration fixture.
- OPC UA Variable and DataValue semantics map to SSOM Observation and measurement-safety fields with governed unit normalization and analytical-consumer expectations.
- OPC UA event and alarm semantics map to SSOM Event, Alarm, and State Transition records with preserved provenance and temporal context.
- ISA-95 equipment and production structures map to SSOM operational boundaries, functional locations, asset classes, equipment models, and asset instances, with detailed hierarchy completion deferred to a named profile.
- MIMOSA lifecycle and interoperability concepts map to SSOM Asset identity, identifier continuity, relationship governance, and reliability work semantics.
- ISO 14224 failure terminology maps to SSOM failure mode, mechanism, cause, work, verification, and outcome semantics.
- IEC 81346 designation concepts can be preserved as engineering reference identifiers, but richer structure rules require a profile.
- IEC 62443 zone and conduit foundations can be represented through operational boundaries, governed relationships, and cyber-managed asset context, but the control framework is still profile-dependent.
- IEC 61511 safety context maps to bypass, event, state-transition, and verification evidence without claiming functional-safety program completeness.
- ServiceNow, historian, EAM, SCADA, OEM cloud, and CMDB identity convergence guidance is now traceable and qualified.
- Formal bounded profiles now exist for ServiceNow serving projection, functional safety foundation, and OT cybersecurity foundation surfaces.

## Claim boundary

- These artifacts support qualified mapping and interoperability statements only.
- They do not claim formal compliance, certification, or universal interchange completeness.
- Profile-dependent mappings are explicitly labeled, and transformation-loss risks are recorded where information loss is possible.