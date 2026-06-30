# SSOM v0.6 Schema Reference

## Observation measurement-safety schemas

| Schema | Purpose | Required anchors |
| --- | --- | --- |
| `schemas/jsonschema/observation.json` | Observation with optional structured measurement safety semantics | `record_id`, `subject_ref`, `metric`, `value`, `event_time`, `quality`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/common.json` | Shared definitions for quantity kind, unit references, conversion lineage, measurement quality, calibration context, signal context, and time synchronization | See shared definitions below |

## Shared measurement definitions

The following reusable definitions are defined in `schemas/jsonschema/common.json`:

- `quantityKind`
- `unitReference`
- `sourceMeasurementRepresentation`
- `originalMeasurement`
- `canonicalMeasurement`
- `conversionLineage`
- `measurementQuality`
- `calibrationContext`
- `measurementRange`
- `measurementPoint`
- `aggregationMethod`
- `signalContext`
- `timeSynchronizationContext`

## Quantity and unit distinctions

- `source_unit` is the governed unit supplied by the source system.
- `canonical_unit` is the governed normalized unit used for safe comparison.
- `quantity_kind` identifies the measured property, not merely a label.
- `engineering_unit` expresses the signal or instrument basis.
- `display_unit` expresses the preferred user-facing display basis.
- `conversion_lineage` records how normalization happened.
- `measurement_quality` records whether the value is trustworthy, stale, missing, degraded, or estimated.
- `signal_context` records what was measured, by which device, under what operational basis.

## Unknown-unit handling note

- SSOM permits preservation of raw source measurements even when the source unit is not yet governed or safely mappable.
- In that case, implementations should preserve original measurement semantics and comparability restrictions rather than inventing unsupported canonical conversions.

## Compatibility notes

- Existing v0.5 identity lifecycle fixtures remain valid.
- Existing v0.4 truth-state fixtures remain valid.
- Existing v0.3 Asset, Relationship, Observation, and Condition fixtures remain valid.
- Structured measurement semantics are additive. Legacy `metric`, `value`, and `unit` projections remain available for compatibility, but they are not sufficient on their own for governed cross-source comparability.