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

## Relationship stewardship

- Core relationship semantics are governed by the machine-readable registry in `schemas/registry/core-relationship-vocabulary.json`.
- New core relationship proposals must document canonical code, label, inverse code, relationship family, subject and object domains, direction, cardinality guidance, temporal expectations, profile applicability, aliases, and deprecation behavior.
- Source-specific relationship names MUST be preserved through namespaced extension relationship codes plus mapping metadata when no approved core term exists.
- A namespaced extension relationship becomes a candidate core relationship only when repeated interoperable use demonstrates durable cross-source semantics rather than a product-private convenience label.
- Maintainers should reject proposals that duplicate an existing core semantic under a different surface label unless the proposal is a backward-compatibility alias with a deprecation plan.

## Controlled vocabulary stewardship

- Core vocabularies for asset forms, equipment roles, device roles, lifecycle roles, operational boundaries, and governed relationship codes are versioned semantic surfaces and must not be changed casually.
- Vocabulary proposals must identify whether they are additive, aliasing, narrowing, or deprecating changes.
- New vocabulary entries should include at least one conformance fixture and one implementation-oriented example showing intended use.
- When a vocabulary term can be expressed as a profile-level refinement instead of a core semantic, the profile route is preferred.

## Extension namespace registration

- Extensions must use a stable namespace prefix that is unlikely to collide with another implementation.
- Extension proposals should declare steward, contact point, semantic scope, and compatibility expectations.
- Namespaced extensions may preserve source semantics, but they must not silently redefine an existing core term.
- If an extension becomes widely reused, maintainers may request a core promotion proposal with migration notes and fixture evidence.

## Profile approval

- A profile proposal must define scope, required schemas, required fixtures, semantic invariants, and claim boundaries.
- Profile claims must distinguish implemented support, validated support, and projected support.
- Projected support is documentation-only unless executable fixtures or implementation evidence are also provided.
- Capability manifests should be updated when a profile is introduced, materially changed, or deprecated.

## Versioning And Compatibility

- Semantic version changes must state whether a change is additive, breaking, or mixed.
- Additive changes should preserve earlier valid fixtures unless a documented correction requires otherwise.
- Breaking changes must identify the affected schema fields, fixture families, migration path, and claim impact.
- Compatibility statements must distinguish normative schema behavior from non-normative examples, projections, and legacy artifacts.

## Deprecation Workflow

- Deprecation must identify the artifact, reason, replacement surface if any, and expected removal timing when known.
- Deprecated artifacts remain non-normative unless explicitly restated otherwise in maintained specifications.
- Placeholder compatibility markers, such as legacy XSD stubs, must clearly say they are not normative schemas.
- Conformance or capability materials should record deprecation posture when an artifact is kept only for discovery compatibility.

## ADR And Proposal Process

- Architectural decisions with cross-profile or long-lived semantic impact should be recorded as ADRs.
- ADRs should capture motivation, alternatives, compatibility consequences, and any deferred questions.
- Issues may begin the discussion, but accepted semantic direction should end in either an RFC update, an ADR, or both.
- Maintainers should avoid merging broad semantic changes without a durable rationale artifact.

## Standards-Mapping Review

- Standards-mapping text must remain qualified unless field-level mapping evidence or a published crosswalk artifact exists.
- Conceptual alignment language is acceptable when it does not imply formal interoperability, certification, or profile completeness.
- Published crosswalk claims require a concrete artifact reference and review of maintenance expectations.
- Reviewers should reject wording that implies compliance beyond what schemas, fixtures, and capability manifests actually prove.

## Security Disclosure

- Security-relevant semantic content, such as cyber-managed asset posture or exposure-oriented extensions, should be reviewed for unnecessary operational sensitivity before publication.
- Vulnerability examples should preserve semantic intent without disclosing live secrets, credentials, or production exploit detail.
- Potential security issues in repository artifacts should be reported privately to maintainers before public disclosure when coordinated handling is warranted.

## Public And Proprietary Boundaries

- SSOM standardizes semantic meaning and conformance surfaces, not proprietary operational logic, vendor scoring models, or closed workflow internals.
- Public artifacts should describe the semantic contract needed for interoperability without forcing publication of proprietary source payloads or private implementation details.
- Capability manifests may describe projected or proprietary support surfaces, but they must clearly separate repository-proven evidence from external or closed implementations.

## Conformance claims

An implementation may state that it conforms to an SSOM profile only when it can provide:
- supported profile list;
- schema-validation results;
- fixture or test results;
- extension list;
- version compatibility statement.

Implementations should also provide, when applicable:
- a capability manifest;
- deprecation posture for retained legacy artifacts;
- qualified standards-mapping language;
- projection-surface declarations when support is documented rather than executed.

## Evolution

This governance model is expected to evolve as adoption grows.
