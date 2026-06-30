# SSOM Functional Safety Foundation Profile v0.9

## Purpose

This profile adds a limited safety foundation for operational context and traceability.

It supports foundational semantics for safety context, bypass state, proof-test evidence, safety-related events, and safety-related work context. It does not claim IEC 61511 compliance or a complete safety lifecycle implementation.

## Supported scope

- Safety Function or Safety Context.
- Sensor element.
- Logic solver.
- Final element.
- Safety-related Asset role.
- Bypass or override state.
- Proof-test or verification evidence.
- Safety-related event.
- Safety-related work context.
- Relationship semantics linking sensor, logic solver, final element, and controlled process asset.

## Profile rules

- Safety context remains explicit and referenceable.
- Bypass or override state must remain visible when active.
- Proof-test and work-verification evidence must remain linked to the safety context.
- Safety-related work closure must not hide an active bypass.
- Controlled process asset context must remain separate from the safety instrumented components that monitor or act on it.

## Fixtures and validation

- Schema: `schemas/jsonschema/safety-foundation-bundle.json`
- Valid fixture: `conformance/fixtures/v0.9/valid/safety-foundation-bundle-sis-proof-test-context.json`
- Invalid fixture: `conformance/fixtures/v0.9/invalid/safety-foundation-bundle-bypass-active-after-work-close.json`

## Boundary statement

This profile provides foundational semantics for safety context and traceability, not a complete safety lifecycle implementation.