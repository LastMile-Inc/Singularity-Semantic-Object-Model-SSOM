# SSOM v0.9 Migration Guidance

## What changed

SSOM v0.9 adds governed relationship semantics and explicit non-serialized operational boundary objects. This update is additive and backward-compatible with v0.8 because prior records remain valid, but implementations claiming v0.9 relationship conformance must stop using unrestricted free-text core relationship types.

## Migration rules

- Keep Asset as the canonical lifecycle identity for serialized or managed entities.
- Use `asset-class.json` for taxonomy concepts and `equipment-model.json` for manufacturer or design models rather than treating either as serialized assets.
- Use `operational-boundary.json` for systems, subsystems, functional systems, process segments, production units, and control entities when those are contextual boundaries rather than commissioned assets.
- Use `functional-location.json` for placement and continuity context; do not collapse functional location into Asset identity.
- Use governed core relationship codes for core semantics.
- Preserve source-specific relationship names through namespaced extension relationship codes plus mapping metadata when no approved core term exists.
- Treat detailed ISA-95 style hierarchy expansion as profile work rather than forcing a complete hierarchy into the core model.

## Practical mapping guidance

- Replace free-text relationship fields such as `mountedInside`, `owns`, or `attachedTo` with either a governed core relationship or a namespaced extension relationship plus mapping metadata.
- Normalize legacy aliases such as `is_installed_on`, `powered_by`, `replaced_by`, and `preceded_by` through the governed registry rather than introducing more synonymous codes.
- Model robot cells, cooling-water systems, and process segments as operational boundaries by default unless the organization explicitly manages the aggregate as a serialized asset in its own right.