# SSOM Migration Guide v1.0

## Scope

This guide describes the release transition from the audited `v0.9.0` draft surface to `SSOM Core v1.0.0`.

The `Last Mile Platform Operations and SSOM Master Profile v1.0.0` remains proprietary, optional, and explicitly outside portable SSOM Core semantics.

## Release posture

- `SSOM Core v1.0.0` is the first stable portable-core release of the audited repository surface.
- The v1.0 promotion program did not add new portable-core semantic families after the audited `v0.9.0` draft surface.
- The v1.0 promotion program hardened release discovery, proof-bundle coverage, proprietary-boundary enforcement, and non-production reference-validation discipline.

## What changes for implementers

- Treat `SSOM Core v1.0.0` as the current stable semantic version for the portable core release surface.
- Continue to treat JSON Schemas under `schemas/jsonschema/` as the normative machine-readable contract.
- Continue to treat placeholder XSD artifacts under `schemas/` as deprecated, non-normative compatibility markers.
- Continue to treat BigQuery artifacts and runtime-validation materials as informative implementation guidance rather than normative semantic definitions.
- Do not treat the proprietary Last Mile platform-operations profile as part of portable SSOM Core.

## Compatibility posture

- The release remains additive relative to the implemented `v0.3` through `v0.9` progression.
- Existing v0.3 through v0.9 fixtures remain part of the validated conformance surface.
- Implementations already aligned to the audited `v0.9.0` draft should not require new semantic-model changes solely to recognize `v1.0.0`.

## Recommended migration actions

1. Update implementation metadata and release documentation to refer to `SSOM Core v1.0.0` where the stable portable-core release is intended.
2. Keep standards, safety, cybersecurity, ServiceNow, and BigQuery claims within the repository's documented qualified boundaries.
3. Use `conformance/checklist-v1.0.md`, `docs/schema-reference-v1.0.md`, and `docs/reviews/SSOM_v1_0_Release_Acceptance_Audit.md` as the current release-gate references.
4. Preserve historical references to `v0.9.0` draft materials only where draft promotion traceability is needed.

## Historical inputs retained

- `docs/candidate-specification-package-v0.9.md`
- `docs/release-readiness-assessment-v0.9.md`
- `docs/reviews/SSOM_Release_Candidate_Acceptance_Audit.md`

These documents remain part of the repository for traceability, but they are superseded as current release-decision artifacts by the final v1.0 release acceptance audit.