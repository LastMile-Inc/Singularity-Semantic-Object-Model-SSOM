# SSOM v1.0 Artifact Inventory

## Normative specifications

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| RFC-0001 foundation | `RFC-0001-SSOM.md` | normative | Foundational RFC and conformance authority pointer. |
| RFC-0002 core operational context and conformance | `RFC-0002-SSOM-Core-Operational-Context-and-Conformance.md` | normative | Current accepted core semantic specification for `SSOM Core v1.0.0`. |

## Core schemas

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Common definitions | `schemas/jsonschema/common.json` | normative | Shared schema definitions. |
| Canonical operational record | `schemas/jsonschema/canonical-operational-record.json` | normative | Envelope for canonical records. |
| Asset | `schemas/jsonschema/asset.json` | normative | Core asset identity surface. |
| Asset class | `schemas/jsonschema/asset-class.json` | normative | Governed class surface. |
| Equipment model | `schemas/jsonschema/equipment-model.json` | normative | Governed model surface. |
| Functional location | `schemas/jsonschema/functional-location.json` | normative | Location semantics. |
| Identity lifecycle event | `schemas/jsonschema/identity-lifecycle-event.json` | normative | Identity continuity and succession events. |
| Operational boundary | `schemas/jsonschema/operational-boundary.json` | normative | Non-serialized operational-boundary semantics. |
| Relationship | `schemas/jsonschema/relationship.json` | normative | Governed relationship instances. |
| Relationship registry | `schemas/jsonschema/relationship-registry.json` | normative | Registry schema for governed relationship data. |
| Observation | `schemas/jsonschema/observation.json` | normative | Measurement and evidence semantics. |
| Source assertion | `schemas/jsonschema/source-assertion.json` | normative | Source truth-state surface. |
| Derived assertion | `schemas/jsonschema/derived-assertion.json` | normative | Derived truth-state surface. |
| Inference | `schemas/jsonschema/inference.json` | normative | Reasoning semantics. |
| Prediction | `schemas/jsonschema/prediction.json` | normative | Predictive semantics. |
| Recommendation | `schemas/jsonschema/recommendation.json` | normative | Recommendation semantics. |
| Decision | `schemas/jsonschema/decision.json` | normative | Decision semantics. |
| Action | `schemas/jsonschema/action.json` | normative | Action semantics. |
| Outcome | `schemas/jsonschema/outcome.json` | normative | Outcome semantics. |
| Condition | `schemas/jsonschema/condition.json` | normative | Condition semantics. |
| Reliability and work schemas | `schemas/jsonschema/symptom.json`, `schemas/jsonschema/failure-mode.json`, `schemas/jsonschema/failure-mechanism.json`, `schemas/jsonschema/failure-cause.json`, `schemas/jsonschema/failure-event.json`, `schemas/jsonschema/diagnostic.json`, `schemas/jsonschema/prognostic.json`, `schemas/jsonschema/maintenance-strategy.json`, `schemas/jsonschema/work-request.json`, `schemas/jsonschema/work-plan.json`, `schemas/jsonschema/work-execution.json`, `schemas/jsonschema/work-verification.json`, `schemas/jsonschema/work-outcome.json` | normative | Reliability, maintenance, verification, and outcome semantics. |
| Event and alarm schemas | `schemas/jsonschema/event.json`, `schemas/jsonschema/alarm.json`, `schemas/jsonschema/state-transition.json` | normative | Event, alarm, and transition semantics. |

## Registries

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Core relationship vocabulary registry | `schemas/registry/core-relationship-vocabulary.json` | normative | Machine-readable governed relationship vocabulary. |

## Profile schemas

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Capability manifest schema | `schemas/jsonschema/capability-manifest.json` | normative | Capability-declaration contract. |
| Standards mapping artifact schema | `schemas/jsonschema/standards-mapping-artifact.json` | normative | Structured standards mapping contract. |
| ServiceNow serving projection bundle | `schemas/jsonschema/servicenow-serving-projection-bundle.json` | normative | Curated ServiceNow projection bundle schema. |
| Safety foundation bundle | `schemas/jsonschema/safety-foundation-bundle.json` | normative | Bounded safety-context bundle schema. |
| Cyber foundation bundle | `schemas/jsonschema/cyber-foundation-bundle.json` | normative | Bounded OT cyber-context bundle schema. |
| Industry profile bundle | `schemas/jsonschema/industry-profile-bundle.json` | normative | Bounded industry-profile schema. |
| Smart-pump cyber proof bundle | `schemas/jsonschema/smart-pump-cyber-proof-bundle.json` | normative | v1.0 executable proof schema. |
| Chiller multi-system proof bundle | `schemas/jsonschema/chiller-multi-system-proof-bundle.json` | normative | v1.0 executable proof schema. |
| AI comparability proof bundle | `schemas/jsonschema/ai-comparability-proof-bundle.json` | normative | v1.0 executable proof schema. |
| ServiceNow outcome-feedback bundle | `schemas/jsonschema/servicenow-outcome-feedback-bundle.json` | normative | v1.0 executable proof schema. |
| Industry profile invalid matrix | `schemas/jsonschema/industry-profile-invalid-matrix.json` | normative | v1.0 adversarial coverage schema. |

## Conformance fixtures

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Core fixture families | `conformance/fixtures/v0.3/`, `conformance/fixtures/v0.4/`, `conformance/fixtures/v0.5/`, `conformance/fixtures/v0.6/`, `conformance/fixtures/v0.7/`, `conformance/fixtures/v0.8/`, `conformance/fixtures/v0.9/` | normative | Historical and current validated conformance corpus for core semantic families. |
| v1.0 proof fixtures | `conformance/fixtures/v1.0/valid/smart-pump-cyber-proof-bundle.json`, `conformance/fixtures/v1.0/valid/chiller-multi-system-proof-bundle.json`, `conformance/fixtures/v1.0/valid/ai-comparability-proof-bundle.json`, `conformance/fixtures/v1.0/valid/servicenow-outcome-feedback-bundle.json` | normative | Positive end-to-end proof coverage used in the release gate. |
| v1.0 adversarial proof fixtures | `conformance/fixtures/v1.0/invalid/smart-pump-cyber-proof-bundle-unauthorized-risk.json`, `conformance/fixtures/v1.0/invalid/chiller-multi-system-proof-bundle-prohibited-telemetry.json`, `conformance/fixtures/v1.0/invalid/ai-comparability-proof-bundle-ineligible-feature.json`, `conformance/fixtures/v1.0/invalid/servicenow-outcome-feedback-bundle-cross-tenant.json`, `conformance/fixtures/v1.0/invalid/cyber-foundation-bundle-non-managed-asset.json`, `conformance/fixtures/v1.0/invalid/industry-profile-invalid-matrix.json` | normative | Negative proof coverage used in the release gate. |

## Validation tools

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Validation harness | `conformance/validate-schemas.mjs` | normative | Authoritative local semantic and discovery validator. |
| Current conformance checklist | `conformance/checklist-v1.0.md` | normative | Current release checklist. |
| Checklist index | `conformance/checklist.md` | informative | Index of versioned conformance checklists. |
| Validation workflow | `.github/workflows/validate.yml` | informative | GitHub CI invocation of `git diff --check` and `npm run validate`. |
| Harness package manifest | `package.json` | informative | Defines the local validation command. |

## Standards crosswalks

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Standards mapping overview | `docs/standards-mapping-v0.9.md` | historical | Retained standards-aware overview from the audited draft phase. |
| Standards crosswalk matrix | `docs/standards-crosswalk-matrix-v0.9.json` | historical | Structured crosswalk support artifact retained for traceability. |
| Source-system mapping guidance | `docs/source-system-mapping-guidance-v0.9.json` | historical | Structured mapping guidance retained for traceability. |
| Transformation-loss register | `docs/transformation-loss-register-v0.9.json` | historical | Documents known mapping limits retained for traceability. |
| Profile applicability matrix | `docs/profile-applicability-matrix-v0.9.json` | historical | Profile qualification support artifact retained for traceability. |
| Standards claims matrix | `docs/standards-claims-matrix-v0.9.json` | historical | Qualified claims support artifact retained for traceability. |

## BigQuery reference architecture

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| BigQuery reference architecture | `docs/bigquery-reference-architecture-v0.9.md` | informative | Provider-specific architecture guidance retained as release-relevant reference material. |
| BigQuery reference schema | `reference-implementation/bigquery/schema.sql` | informative | Typed provider-specific reference DDL. |
| BigQuery reference queries | `reference-implementation/bigquery/example-queries.sql` | informative | Provider-specific example query surface. |

## Runtime-validation package

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Reference-validation package overview | `reference-validation/README.md` | informative | Non-production runtime-validation package overview. |
| BigQuery non-production validation plan | `reference-validation/bigquery/nonproduction-validation-plan-v1.0.md` | informative | Reproducible non-production execution guidance. |
| BigQuery non-production validation queries | `reference-validation/bigquery/nonprod-validation-queries.sql` | informative | Parameterized non-production validation query set. |
| Reproducibility checklist | `reference-validation/bigquery/reproducibility-checklist-v1.0.md` | informative | Required runtime evidence capture checklist. |
| Runtime capture template | `reference-validation/bigquery/runtime-capture-template-v1.0.md` | informative | Template for measured non-production runtime evidence. |

## Governance materials

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Governance model | `governance.md` | normative | Governance boundary and change-control reference. |
| Security policy | `SECURITY.md` | informative | Security reporting guidance. |
| ADR directory | `docs/adr/` | informative | Historical and supporting architectural decisions. |
| Issue templates and CI | `.github/ISSUE_TEMPLATE/`, `.github/workflows/validate.yml` | informative | Review intake and CI execution support. |

## Migration guides

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Current migration guide | `docs/migration-v1.0.md` | informative | Current release transition guidance for the stable core release. |
| Prior migration guides | `docs/migration-v0.3.md`, `docs/migration-v0.4.md`, `docs/migration-v0.5.md`, `docs/migration-v0.6.md`, `docs/migration-v0.7.md`, `docs/migration-v0.8.md`, `docs/migration-v0.9.md` | historical | Retained transition history for prior draft phases. |

## Release audit

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Final v1.0 release acceptance audit | `docs/reviews/SSOM_v1_0_Release_Acceptance_Audit.md` | informative | Current authoritative release-gate decision artifact. |
| Release execution guide | `docs/releases/SSOM_v1_0_Release_Execution_Guide.md` | informative | Human-controlled synchronization and release procedure. |
| Pull-request summary | `docs/releases/SSOM_v1_0_GitHub_Pull_Request_Summary.md` | informative | Prepared PR body for merge review. |
| Release notes | `docs/releases/SSOM_v1_0_Release_Notes.md` | informative | Controlled-review release notes. |
| Artifact inventory | `docs/releases/SSOM_v1_0_Artifact_Inventory.md` | informative | Release inventory and classification reference. |

## Proprietary Last Mile profile artifacts

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Proprietary profile documentation | `docs/last-mile-platform-operations-and-ssom-master-profile-v1.0.md` | proprietary | Current proprietary profile boundary and release designation. |
| Proprietary profile schema | `schemas/jsonschema/last-mile-platform-operations-profile.json` | proprietary | Machine-readable proprietary profile contract. |
| Proprietary valid fixtures | `conformance/fixtures/v1.0/valid/last-mile-platform-profile-multi-tenant-control-plane.json`, `conformance/fixtures/v1.0/valid/last-mile-platform-profile-master-learning-observability.json` | proprietary | Positive boundary enforcement fixtures. |
| Proprietary invalid fixtures | `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-cross-tenant-shared-raw-evidence.json`, `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-master-learning-unapproved-inputs.json`, `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-agent-raw-evidence-mirror.json`, `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-binding-unknown-tenant.json` | proprietary | Negative boundary enforcement fixtures. |

## Historical artifacts retained for traceability

| Artifact name | Path | Status | Release relevance |
| --- | --- | --- | --- |
| Candidate specification package | `docs/candidate-specification-package-v0.9.md` | historical | Pre-v1.0 controlled-review package retained for traceability. |
| Release readiness assessment | `docs/release-readiness-assessment-v0.9.md` | historical | Pre-v1.0 publication recommendation retained for traceability. |
| Release candidate acceptance audit | `docs/reviews/SSOM_Release_Candidate_Acceptance_Audit.md` | historical | Draft-stage audit superseded by the final v1.0 release audit. |
| Prior schema references | `docs/schema-reference-v0.4.md`, `docs/schema-reference-v0.5.md`, `docs/schema-reference-v0.6.md`, `docs/schema-reference-v0.7.md`, `docs/schema-reference-v0.8.md`, `docs/schema-reference-v0.9.md` | historical | Prior discovery surfaces retained for traceability. |
| Deprecated XSD markers | `schemas/ssom-core.xsd`, `schemas/ssom-relationships.xsd`, `schemas/ssom-telemetry.xsd` | deprecated | Legacy compatibility markers explicitly not normative for the current release. |