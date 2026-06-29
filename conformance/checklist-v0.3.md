# SSOM v0.3 Conformance Checklist

## Core Asset and Relationship Profile
- [ ] Assets use globally unique SSOM asset URIs.
- [ ] Asset source references and identity confidence are retained.
- [ ] Asset remains the canonical lifecycle identity for relationships, condition, work history, and outcomes.
- [ ] Assets may validate with Equipment roles only.
- [ ] Assets may validate with Device roles only.
- [ ] Assets may validate with both Equipment and Device roles.
- [ ] Assets may validate with neither Equipment nor Device role when classification evidence is unavailable.
- [ ] Equipment and Device are not modeled as mutually exclusive inheritance branches.
- [ ] Relationships are typed, first-class records.
- [ ] Relationship provenance, confidence, and effective period are retained.

## Asset Classification Profile
- [ ] `asset_form` uses the governed SSOM v0.3 vocabulary or a declared extension.
- [ ] `equipment_roles[]`, `device_roles[]`, and `lifecycle_roles[]` use governed SSOM vocabularies or declared extensions.
- [ ] Classification assertions retain scheme, category, code, confidence, and traceability metadata.
- [ ] Source-specific types are preserved as source assertions or source metadata when mapped into SSOM classifications.
- [ ] Derived classifications remain traceable to source data or derivation logic.
- [ ] `primary_operational_role` is optional and does not imply exclusivity.

## Observation/Event/Alarm Profile
- [ ] Records identify a subject, time, provenance, quality, and delivery classification.
- [ ] Source authority and source reference are retained.
- [ ] Live, retained, replay, backfill, late, reconstructed, and manual classifications are used where known.
- [ ] Units are stated where applicable.
- [ ] Invalid records are rejected or quarantined with evidence.

## Quality, Provenance, and Temporal Integrity Profile
- [ ] Quality status and validation state are present.
- [ ] Source, receive, and processing times are distinguishable where available.
- [ ] Mapping package and mapping version are retained when transformation occurs.
- [ ] Lineage can reconstruct the transformation path.

## Condition Profile
- [ ] Conditions contain subject, type, lifecycle, severity, confidence, evidence references, and provenance.
- [ ] Conditions are distinguishable from raw observation and event data.
- [ ] Suppression, recurrence, maintenance, and resolution context are represented where applicable.

## Equipment and Device Interaction Profile
- [ ] Relationship predicates such as `controls`, `measures`, `actuates`, and `protects` validate correctly.
- [ ] Smart and connected assets such as VFDs, smart pumps, and robot cells can be represented as both Equipment and Device where evidence supports both.
- [ ] Functional systems are distinguished from physical Asset instances unless explicitly mastered as Assets.

## Analytical Warehouse Profile
- [ ] Analytical storage retains SSOM version, lineage, provenance, quality, temporal integrity, and classification projections.
- [ ] Raw evidence references are retained separately from large payloads where appropriate.
- [ ] Reprocessing can identify source lineage and transformation version.