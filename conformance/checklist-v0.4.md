# SSOM v0.4 Conformance Checklist

## Core Asset and Relationship Profile
- [ ] Assets use globally unique SSOM asset URIs.
- [ ] Asset source references and identity confidence are retained.
- [ ] Asset remains the canonical lifecycle identity for relationships, condition, decisions, actions, and outcomes.
- [ ] Relationships are typed, first-class records.
- [ ] Relationship provenance, confidence, and effective period are retained.

## Observation Profile
- [ ] Observations contain subject, metric, value, event time, quality, provenance, temporal integrity, and SSOM version.
- [ ] Observations are not silently upgraded into governed conclusions.
- [ ] Observation corrections or supersession lineage is retained where used.

## Semantic Truth and Decision Lifecycle Profile
- [ ] Source Assertions are distinct from Observations and retain source attribution.
- [ ] Derived Assertions retain evidence references and derivation method.
- [ ] Inferences retain evidence references, derivation method, confidence, and responsible model or actor.
- [ ] Predictions retain evidence references, target, prediction horizon, and confidence.
- [ ] Recommendations retain intended target, rationale, priority, confidence, evidence references, and expected outcome.
- [ ] Decisions retain decision status, context references, evidence references, and either decision actor or governed decision authority.
- [ ] Actions retain target, status, execution time, and basis references.
- [ ] Outcomes distinguish intended outcome from observed outcome and retain evidence references.
- [ ] Contradictory source assertions can coexist without forced reconciliation.
- [ ] Correction or supersession lineage is retained where truth-state records are revised.
- [ ] Correction or supersession lineage preserves both the prior record and the revised record rather than rewriting history.
- [ ] Late-arriving evidence can trigger revised assertions, inferences, recommendations, or outcomes while retaining prior provenance and temporal context.

## Quality, Provenance, and Temporal Integrity Profile
- [ ] Quality status and validation state are present.
- [ ] Source, receive, and processing times are distinguishable where available.
- [ ] Mapping package and mapping version are retained when transformation occurs.
- [ ] Lineage can reconstruct the transformation path.

## Condition Profile
- [ ] Conditions contain subject, type, lifecycle, severity, confidence, evidence references, and provenance.
- [ ] Conditions remain distinguishable from Observation, Source Assertion, Inference, and Recommendation records.

## Planned Profile Scope
- [ ] Implementations do not claim Event or Alarm conformance from this repository version unless they publish dedicated profile-specific schemas and tests.
- [ ] Implementations do not claim detailed work-execution or maintenance conformance from the generic Action and Outcome foundation alone.