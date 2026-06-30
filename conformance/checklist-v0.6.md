# SSOM v0.6 Conformance Checklist

## Core Asset and Relationship Profile
- [ ] Assets use globally unique SSOM Asset URIs.
- [ ] Asset source references and identity confidence are retained.
- [ ] Relationships preserve provenance, confidence, and effective period.
- [ ] Succession relationships use governed semantics such as `replaces`, `succeeds`, `split_into`, or `merged_from` where applicable.

## Asset Identity and Continuity Profile
- [ ] Canonical SSOM Asset IDs are never reused.
- [ ] Assets may hold multiple external identifiers at the same time.
- [ ] Identifier assignments retain role, scope, authority, provenance, confidence, verification status, and validity period.
- [ ] Identifier reuse across Assets is allowed only when validity periods do not overlap within the same scope and authority.
- [ ] Functional Location remains distinct from canonical Asset identity.

## Observation Measurement Safety Profile
- [ ] Observations preserve subject, metric, value, event time, quality, provenance, temporal integrity, and SSOM version.
- [ ] Original source measurement and canonical normalized measurement are distinct when structured normalization is used.
- [ ] Canonical measurement declares explicit quantity kind and canonical unit.
- [ ] Unit references use governed unit codes or approved governed unit references rather than arbitrary primary strings.
- [ ] Conversion lineage preserves source unit, canonical unit, conversion method, conversion version, conversion actor or service, and conversion timestamp.
- [ ] Dimensional incompatibility between quantity kind and unit is rejected or flagged.
- [ ] Missing, unknown, stale, degraded, or estimated measurement states are representable in structured fields.
- [ ] Calibration context is structured when calibration affects trust or comparability.
- [ ] Signal context identifies the measurement target and preserves engineering or display unit distinctions where relevant.
- [ ] Time synchronization context preserves source timestamp, ingestion timestamp, and late-arrival or out-of-order status where relevant.
- [ ] Implementations do not treat a value as operationally comparable merely because it is numeric.

## Semantic Truth and Decision Lifecycle Profile
- [ ] Observation semantics remain distinct from Condition, Event, Alarm, Inference, Recommendation, Decision, Action, and Outcome semantics.
- [ ] Truth-state evidence chains remain intact after measurement-safety updates.

## Planned Profile Scope
- [ ] Implementations do not claim dedicated Event or Alarm profile conformance from this repository version alone.
- [ ] Implementations do not claim a universal SSOM unit catalog from this repository version alone.