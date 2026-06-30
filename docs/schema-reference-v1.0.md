# SSOM v1.0 Discovery Surface Reference

This document is the release-discovery index for the SSOM v1.0 promotion program. It does not by itself declare that SSOM has been promoted to `v1.0.0`. It identifies the artifacts that must remain coherent, discoverable, and validation-backed before a final v1.0 decision can be made.

## Core normative specification

- `RFC-0001-SSOM.md`
- `RFC-0002-SSOM-Core-Operational-Context-and-Conformance.md`
- `governance.md`
- `README.md`

## Core schema family

### Foundational envelopes and shared structures

- `schemas/jsonschema/common.json`
- `schemas/jsonschema/canonical-operational-record.json`

### Asset, identity, boundary, and relationship surfaces

- `schemas/jsonschema/asset.json`
- `schemas/jsonschema/asset-class.json`
- `schemas/jsonschema/equipment-model.json`
- `schemas/jsonschema/functional-location.json`
- `schemas/jsonschema/identity-lifecycle-event.json`
- `schemas/jsonschema/operational-boundary.json`
- `schemas/jsonschema/relationship.json`
- `schemas/jsonschema/relationship-registry.json`
- `schemas/registry/core-relationship-vocabulary.json`

### Observation, truth-state, and reasoning surfaces

- `schemas/jsonschema/observation.json`
- `schemas/jsonschema/source-assertion.json`
- `schemas/jsonschema/derived-assertion.json`
- `schemas/jsonschema/inference.json`
- `schemas/jsonschema/prediction.json`
- `schemas/jsonschema/recommendation.json`
- `schemas/jsonschema/decision.json`
- `schemas/jsonschema/action.json`
- `schemas/jsonschema/outcome.json`
- `schemas/jsonschema/condition.json`

### Reliability, work, and outcome surfaces

- `schemas/jsonschema/symptom.json`
- `schemas/jsonschema/failure-mode.json`
- `schemas/jsonschema/failure-mechanism.json`
- `schemas/jsonschema/failure-cause.json`
- `schemas/jsonschema/failure-event.json`
- `schemas/jsonschema/diagnostic.json`
- `schemas/jsonschema/prognostic.json`
- `schemas/jsonschema/maintenance-strategy.json`
- `schemas/jsonschema/work-request.json`
- `schemas/jsonschema/work-plan.json`
- `schemas/jsonschema/work-execution.json`
- `schemas/jsonschema/work-verification.json`
- `schemas/jsonschema/work-outcome.json`

### Event, alarm, and transition surfaces

- `schemas/jsonschema/event.json`
- `schemas/jsonschema/alarm.json`
- `schemas/jsonschema/state-transition.json`

## Capability and standards-governance surfaces

- `schemas/jsonschema/capability-manifest.json`
- `schemas/jsonschema/standards-mapping-artifact.json`
- `docs/capability-manifest-v0.9.md`
- `docs/standards-mapping-v0.9.md`
- `docs/standards-crosswalk-matrix-v0.9.json`
- `docs/source-system-mapping-guidance-v0.9.json`
- `docs/transformation-loss-register-v0.9.json`
- `docs/profile-applicability-matrix-v0.9.json`
- `docs/standards-claims-matrix-v0.9.json`

## Profile-specific schema family

- `schemas/jsonschema/servicenow-serving-projection-bundle.json`
- `schemas/jsonschema/safety-foundation-bundle.json`
- `schemas/jsonschema/cyber-foundation-bundle.json`
- `schemas/jsonschema/industry-profile-bundle.json`

## v1.0 promotion proof schemas

- `schemas/jsonschema/smart-pump-cyber-proof-bundle.json`
- `schemas/jsonschema/chiller-multi-system-proof-bundle.json`
- `schemas/jsonschema/ai-comparability-proof-bundle.json`
- `schemas/jsonschema/servicenow-outcome-feedback-bundle.json`
- `schemas/jsonschema/industry-profile-invalid-matrix.json`

## Profile documents

- `docs/servicenow-serving-projection-profile-v0.9.md`
- `docs/functional-safety-foundation-profile-v0.9.md`
- `docs/ot-cybersecurity-foundation-profile-v0.9.md`
- `docs/industry-profile-index-v0.9.md`

## Conformance and validation authority

- `conformance/validate-schemas.mjs`
- `conformance/checklist-v0.9.md`
- `conformance/fixtures/`

### Workstream 2 proof and adversarial fixtures

- `conformance/fixtures/v1.0/valid/smart-pump-cyber-proof-bundle.json`
- `conformance/fixtures/v1.0/valid/chiller-multi-system-proof-bundle.json`
- `conformance/fixtures/v1.0/valid/ai-comparability-proof-bundle.json`
- `conformance/fixtures/v1.0/valid/servicenow-outcome-feedback-bundle.json`
- `conformance/fixtures/v1.0/invalid/smart-pump-cyber-proof-bundle-unauthorized-risk.json`
- `conformance/fixtures/v1.0/invalid/chiller-multi-system-proof-bundle-prohibited-telemetry.json`
- `conformance/fixtures/v1.0/invalid/ai-comparability-proof-bundle-ineligible-feature.json`
- `conformance/fixtures/v1.0/invalid/servicenow-outcome-feedback-bundle-cross-tenant.json`
- `conformance/fixtures/v1.0/invalid/cyber-foundation-bundle-non-managed-asset.json`
- `conformance/fixtures/v1.0/invalid/industry-profile-invalid-matrix.json`

## BigQuery and architecture guidance

- `docs/bigquery-reference-architecture-v0.9.md`
- `docs/IMPLEMENTATION-BOUNDARY-GUIDANCE.md`
- `reference-implementation/bigquery/schema.sql`
- `reference-implementation/bigquery/example-queries.sql`
- `reference-validation/README.md`
- `reference-validation/bigquery/nonproduction-validation-plan-v1.0.md`
- `reference-validation/bigquery/nonprod-validation-queries.sql`
- `reference-validation/bigquery/reproducibility-checklist-v1.0.md`
- `reference-validation/bigquery/runtime-capture-template-v1.0.md`

## Release-readiness surfaces

- `docs/candidate-specification-package-v0.9.md`
- `docs/release-readiness-assessment-v0.9.md`
- `docs/reviews/SSOM_Release_Candidate_Acceptance_Audit.md`
- `CHANGELOG.md`

## Last Mile platform and master-profile surfaces

These are release-relevant to the v1.0 promotion program, but they are not part of portable SSOM Core semantics.

- `docs/last-mile-platform-operations-and-ssom-master-profile-v1.0.md`
- `schemas/jsonschema/last-mile-platform-operations-profile.json`
- `conformance/fixtures/v1.0/valid/last-mile-platform-profile-multi-tenant-control-plane.json`
- `conformance/fixtures/v1.0/valid/last-mile-platform-profile-master-learning-observability.json`
- `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-cross-tenant-shared-raw-evidence.json`
- `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-master-learning-unapproved-inputs.json`
- `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-agent-raw-evidence-mirror.json`
- `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-binding-unknown-tenant.json`
- `conformance/fixtures/v1.0/valid/`
- `conformance/fixtures/v1.0/invalid/`
- `reference-validation/`

## Legacy compatibility markers

These artifacts are retained only as deprecated, non-normative compatibility markers and must not be presented as the current normative schema surface.

- `schemas/ssom-core.xsd`
- `schemas/ssom-relationships.xsd`
- `schemas/ssom-telemetry.xsd`

## Discovery rules

- JSON Schemas under `schemas/jsonschema/` are the normative machine-readable schema surface for the repository.
- The relationship registry in `schemas/registry/core-relationship-vocabulary.json` is a governed machine-readable semantic surface.
- Release readiness requires the validator, versioned conformance checklist, fixtures, standards artifacts, profile documents, and reference-architecture documents to remain mutually consistent.
- BigQuery artifacts are informative, provider-specific reference architecture materials and are not the normative semantic contract.
- Last Mile platform-operations artifacts define a proprietary operating profile and must remain distinct from portable SSOM Core.