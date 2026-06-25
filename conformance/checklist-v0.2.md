# SSOM v0.2 Conformance Checklist

## Core Asset and Relationship Profile
- [ ] Assets use globally unique SSOM asset URIs.
- [ ] Asset source references and identity confidence are retained.
- [ ] Relationships are typed, first-class records.
- [ ] Relationship provenance and confidence are retained.
- [ ] Extensions are namespaced and do not alter core meaning.

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

## Analytical Warehouse Profile
- [ ] Analytical storage retains SSOM version, lineage, provenance, quality, and temporal integrity.
- [ ] Raw evidence references are retained separately from large payloads where appropriate.
- [ ] Reprocessing can identify source lineage and transformation version.
