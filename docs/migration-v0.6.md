# SSOM v0.6 Migration Guide

SSOM v0.6.0 is an additive, backward-compatible release relative to the v0.5 draft.

## Migration summary

1. Existing Assets, Relationships, Conditions, identity lifecycle records, and truth-state records remain valid.
2. Existing legacy Observations that only carry `metric`, `value`, and `unit` remain valid, but they are not sufficient for safe cross-source comparison when quantity, unit, quality, calibration, or timing ambiguity matters.
3. Structured measurement semantics now preserve original source measurement separately from canonical normalized measurement.
4. Canonical measurement now requires explicit quantity kind and governed canonical unit when structured normalization is used.
5. Conversion lineage, structured measurement quality, calibration context, signal context, and time-synchronization context can now be represented directly on Observation records.

## Practical warning

> A value is not operationally comparable merely because it is numeric.

## Recommended migration steps

1. Preserve existing `metric`, `value`, and `unit` projections for backward-compatible consumers.
2. Add `original_measurement` whenever the source system provides a measured value with source unit and source timestamp.
3. Add `canonical_measurement` only when quantity kind and canonical unit are explicit and governed.
4. Add `conversion_lineage` whenever canonical normalization is applied. Do not overwrite the original source value.
5. Add `measurement_quality` when communication quality, stale-data state, missing-data state, validity, uncertainty, accuracy, or precision are operationally relevant.
6. Add `calibration_context` when sensor or instrument calibration status affects trust or comparability.
7. Add `signal_context` to distinguish engineering unit, display unit, operating mode, aggregation method, range, setpoint, and baseline semantics.
8. Add `time_synchronization_context` when late-arriving, replayed, or out-of-order telemetry must be recognized explicitly.

## Unit and quantity conventions

- `quantity_kind` identifies the measured property such as pressure, temperature, volumetric flow rate, vibration acceleration, vibration velocity, valve fraction-open position, or valve travel length.
- `source_unit` preserves the unit as supplied by the source.
- `canonical_unit` preserves the approved normalized unit used for governed comparison.
- `engineering_unit` preserves the unit basis of the signal or instrument range.
- `display_unit` preserves the unit chosen for user-facing or operator-facing display.

SSOM does not define a universal unit catalog. Instead, it provides a governed unit-reference structure that can map to recognized unit vocabularies or approved source-specific code systems.

## Compatibility statement

- **Status:** Fully backward-compatible and additive for existing v0.5 fixtures.
- **Migration warnings:** Systems that currently compare numeric values across sites without governed quantity kind, unit, conversion lineage, and timing context require remediation.
- **Breaking changes:** None for legacy-conformant v0.5 Asset, Relationship, Observation, Condition, and truth-state payloads.