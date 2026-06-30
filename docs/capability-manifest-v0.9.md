# SSOM Capability Manifest v0.9

## Purpose

The capability manifest provides a machine-readable declaration of which SSOM profiles an implementation supports, what evidence backs those claims, how standards-mapping language is qualified, and how legacy non-normative artifacts are handled.

## Included Artifacts

- Schema: `schemas/jsonschema/capability-manifest.json`
- Valid fixture: `conformance/fixtures/v0.9/valid/capability-manifest-core-profiles.json`
- Invalid fixture: `conformance/fixtures/v0.9/invalid/capability-manifest-overclaim-standards-and-legacy.json`
- Validator: `conformance/validate-schemas.mjs`

## What The Manifest Declares

- Supported profiles and their evidence references
- Whether support is implemented, validated, or only projected onto a documented surface
- Executable schema-validation and fixture-validation evidence
- Backward-compatibility posture
- Legacy artifact handling for deprecated XSD placeholders and reference SQL examples
- Qualified standards-mapping claims that avoid overclaiming formal crosswalk support

## Current Repository Posture

The v0.9 manifest declares validated support for truth-state lineage, identity lifecycle, measurement safety, reliability and maintenance, event and alarm, relationship governance, the integrated lifecycle profile, the ServiceNow serving projection profile, the functional safety foundation profile, and the OT cybersecurity foundation profile.

## Guardrails

The invalid fixture demonstrates that a capability manifest is rejected when it:

- repeats the same supported profile claim;
- claims a published standards crosswalk without linking one; or
- treats placeholder XSD artifacts as something other than deprecated non-normative artifacts.