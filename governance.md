# SSOM Governance

## Purpose

This document describes how SSOM proposals, profiles, extensions, schemas, and conformance materials are discussed and maintained.

## Principles

- Vendor neutrality
- Open review
- Technical merit over commercial preference
- Compatibility and clarity
- Publicly documented decisions
- Extension without fragmentation

## Roles

- **Maintainer / Editor:** coordinates discussion, preserves the neutral scope of the standard, and documents accepted or rejected proposals.
- **Contributors:** open to public participation through issues and pull requests.
- **Reviewers:** invited or ad hoc technical reviewers who help evaluate semantics, compatibility, and conformance impact.

## Decision process

- Lazy consensus is preferred when discussion is active and objections are resolved.
- Issues and pull requests are the primary public discussion mechanism.
- Maintainers resolve deadlock when consensus cannot be reached.
- Significant decisions should record rationale, compatibility impact, and any follow-up work.

## RFC process

1. Propose a change through an issue or draft RFC.
2. State motivation, scope, compatibility, examples, and alternatives.
3. Allow public discussion.
4. Add test fixtures and schema changes where relevant.
5. Document maintainer decision and rationale.
6. Version the resulting specification.

## Extension process

Extensions must:
- use a unique namespace;
- identify an owner or steward;
- document semantics;
- specify versioning;
- avoid redefining SSOM core;
- include fixtures;
- state compatibility behavior.

## Conformance claims

An implementation may state that it conforms to an SSOM profile only when it can provide:
- supported profile list;
- schema-validation results;
- fixture or test results;
- extension list;
- version compatibility statement.

## Evolution

This governance model is expected to evolve as adoption grows.
