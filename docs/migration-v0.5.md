# SSOM v0.5 Migration Guide

SSOM v0.5.0 is an additive, backward-compatible release relative to the v0.4 draft.

## Migration summary

1. Existing Assets, Relationships, Observations, Conditions, and truth-state records remain valid.
2. Existing source references may remain in place, but implementations should add governed `identifier_assignments[]` when identity continuity matters.
3. Canonical SSOM Asset identity remains stable and must not be reused.
4. External identifiers such as engineering tags, CMDB CI IDs, historian tags, and OPC UA node IDs are now modeled as time-bound assignments rather than assumed immutable identity.
5. Functional Location remains distinct from Asset identity, though functional-location references may still be preserved where needed.
6. Replacement, recommission, split, merge, and source-system migration scenarios can now be expressed explicitly.

## Recommended migration steps

1. Preserve existing `asset_id` values and source references.
2. Add `identity.identifier_assignments[]` where cross-source continuity, aliasing, or reuse-over-time matters.
3. Use identifier roles and scopes to distinguish engineering tags, serial numbers, CMDB IDs, OPC UA node identities, historian paths, and OEM cloud identities.
4. Represent functional location as a distinct relationship target or functional-location object rather than as canonical Asset identity.
5. Add succession relationships and `identity-lifecycle-event.json` records for replacement, recommission, split, merge, relocation, and source-system migration scenarios when those distinctions matter.

## Compatibility statement

- **Status:** Fully backward-compatible and additive for existing v0.4 fixtures.
- **Migration warnings:** Implementations that currently treat engineering tags, historian paths, or CMDB IDs as globally immutable identities require mapping updates.
- **Breaking changes:** None for legacy-conformant v0.4 Asset, Relationship, Observation, Condition, and truth-state payloads.