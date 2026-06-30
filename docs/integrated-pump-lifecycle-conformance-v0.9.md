# Integrated Pump Lifecycle Conformance v0.9

## Purpose

This scenario is the executable cross-feature conformance bundle for Pump `P-101`. It proves that SSOM v0.9 semantics remain coherent when truth-state, measurement safety, reliability outcome, governed relationships, and identity continuity are combined in one lifecycle story.

## Scenario summary

- Pump `P-101` has rising vibration observations from multiple sources using compatible vibration-velocity units.
- Original source values and units are preserved while canonical normalized values remain governed in `mm/s`.
- A PLC state assertion says the pump is operating normally while OEM monitoring evidence indicates degradation.
- A derived assertion, inference, prediction, recommendation, decision, work request, work plan, work execution, work verification, and work outcome are linked in one traceable chain.
- Immediate post-work verification shows reduced vibration.
- Longer-term evidence shows no sustained reliability improvement and records recurrence.
- The original Pump `P-101` is later replaced at the same functional location with the same engineering tag, but the replacement receives a new canonical SSOM Asset identity.

## Proven invariants

- Original and replacement pumps have distinct canonical SSOM Asset IDs.
- Engineering tag reuse occurs only through non-overlapping validity intervals.
- Functional location continuity does not imply asset identity continuity.
- Cross-source velocity observations preserve source unit, canonical unit, quantity kind, and conversion lineage.
- Contradictory source assertions are preserved without destructive reconciliation.
- Inference, recommendation, decision, work execution, work verification, and work outcome remain distinct semantic states.
- Immediate vibration reduction does not automatically imply sustained reliability improvement.
- Recurrence remains linked to the earlier work and failure context.
- Replacement preserves predecessor and successor history plus identity lifecycle evidence.

## Files

- Valid bundle: `conformance/fixtures/v0.9/valid/integrated-bundle-pump-p101-lifecycle.json`
- Invalid bundle: `conformance/fixtures/v0.9/invalid/integrated-bundle-pump-p101-overlapping-tag-reuse.json`
- Semantic validation: `conformance/validate-schemas.mjs`