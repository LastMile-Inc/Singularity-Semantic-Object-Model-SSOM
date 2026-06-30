# SSOM v0.5 Schema Reference

## Identity lifecycle schemas

| Schema | Purpose | Required anchors |
| --- | --- | --- |
| `schemas/jsonschema/asset.json` | Canonical Asset plus optional time-bound identifier assignments | `asset_id`, `asset_type`, `display_name`, `lifecycle_state`, `identity`, `ssom_version` |
| `schemas/jsonschema/functional-location.json` | Distinct functional or engineering location context | `location_id`, `display_name`, `location_type`, `ssom_version` |
| `schemas/jsonschema/identity-lifecycle-event.json` | Identity-affecting lifecycle event | `event_id`, `event_type`, `subject_refs`, `effective_time`, `provenance`, `temporal_integrity`, `ssom_version` |
| `schemas/jsonschema/relationship.json` | Includes succession relationships such as `replaces`, `split_into`, and `merged_from` | `relationship_id`, `relationship_type`, `from_ref`, `to_ref`, `provenance`, `confidence` |

## Shared identity definitions

The following reusable definitions are defined in `schemas/jsonschema/common.json`:

- `identifierRole`
- `identifierSemanticUsage`
- `identifierVerificationStatus`
- `identifierScope`
- `identifierAuthority`
- `identifierAssignment`
- `identityLifecycleEventType`
- `assetSuccessionType`

## Compatibility notes

- Existing v0.4 truth-state fixtures remain valid.
- Existing v0.3 Asset, Relationship, Observation, and Condition fixtures remain valid.
- External identifiers are now modeled as optional additive assignments; they do not replace canonical SSOM Asset identity.