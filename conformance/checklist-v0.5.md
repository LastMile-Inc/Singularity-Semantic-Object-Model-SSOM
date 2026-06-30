# SSOM v0.5 Conformance Checklist

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
- [ ] Source identity conflict is preserved rather than silently deleted.
- [ ] Functional Location remains distinct from canonical Asset identity.
- [ ] Functional-location references, when used, are modeled as distinct contextual references or relationship targets.
- [ ] Replacement, recommission, split, merge, and source-system migration scenarios preserve canonical Asset continuity correctly.

## Observation Profile
- [ ] Observations contain subject, metric, value, event time, quality, provenance, temporal integrity, and SSOM version.

## Semantic Truth and Decision Lifecycle Profile
- [ ] Truth-state records remain distinguishable from identity lifecycle records.
- [ ] Truth-state evidence chains remain intact after identity continuity updates.

## Planned Profile Scope
- [ ] Implementations do not claim detailed work-execution or Event or Alarm conformance from this repository version alone.