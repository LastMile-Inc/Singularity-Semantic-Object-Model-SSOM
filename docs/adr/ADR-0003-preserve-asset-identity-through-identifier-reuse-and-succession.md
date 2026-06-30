# ADR-0003: Preserve Asset Identity Through Identifier Reuse and Succession

## Context

SSOM previously had stable Asset IDs and source references, but it did not explicitly model identifier reuse over time, aliasing, replacement, recommissioning, split, merge, or source-system identity migration. That made cross-source identity convergence and historical continuity too fragile.

## Decision

SSOM will preserve canonical Asset identity separately from external identifier assignments, functional location context, and succession semantics.

## Rationale

This decision supports asset continuity during replacement, historian and OPC UA migrations, CMDB and EAM reconciliation, acquired-plant duplicate tags, and lifecycle reasoning without reusing canonical identity.

## Consequences

Positive consequences:

- Better historical continuity and cross-source reconciliation.
- Better handling of engineering-tag reuse and source-system migration.
- Better distinction between Asset identity and location, class, or model.

Negative consequences:

- More identity structures to govern.
- Need for explicit scope and authority rules.
- Need for bundle-level validation beyond single-record schema checks.

## Rejected alternative

Do not treat engineering tags, historian paths, CMDB IDs, or OPC UA node IDs as globally immutable Asset identity.