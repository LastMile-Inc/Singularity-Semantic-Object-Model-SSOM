# SSOM Candidate Specification Package v0.9

## 1. Executive Overview

SSOM is a draft, AI-native, vendor-neutral industrial semantic and evidence model with executable schema and fixture validation. The repository now includes governed core semantics, qualified standards crosswalks, a cloud-scale BigQuery reference architecture, bounded ServiceNow serving, safety, and cybersecurity profiles, and initial industry-profile scaffolds suitable for disciplined external review.

SSOM is not positioned here as the definitive OT standard. It is positioned as a serious candidate specification for review by industrial partners, platform providers, standards participants, and early implementers.

## 2. Core Normative Specification Index

- Core foundation: `RFC-0001-SSOM.md`
- Core operational context and conformance: `RFC-0002-SSOM-Core-Operational-Context-and-Conformance.md`
- JSON Schemas: `schemas/jsonschema/`
- Governed relationship registry: `schemas/registry/core-relationship-vocabulary.json`
- Conformance harness: `conformance/validate-schemas.mjs`
- Promotion-program discovery surface: `docs/schema-reference-v1.0.md`

## 3. Version And Compatibility Statement

- Current semantic version: `v0.9.0` draft.
- Compatibility posture: additive across the implemented v0.3 through v0.9 semantic families.
- Legacy compatibility markers such as XSD placeholders remain deprecated and non-normative.
- Reference SQL and provider-specific architecture artifacts remain informative and non-normative.

## 4. Governance Model

- Governance document: `governance.md`
- Decision style: public discussion with maintainer resolution and fixture-backed change discipline.
- Extension and profile approval require scope, evidence, semantic invariants, and claim boundaries.

## 5. Conformance Model

- Conformance checklist: `conformance/checklist-v0.9.md`
- Validation command: `npm run validate`
- Conformance surface: JSON Schema validation, semantic validation, fixture validation, and static documentation coverage checks.

## 6. Capability-Manifest Model

- Capability manifest schema: `schemas/jsonschema/capability-manifest.json`
- Human summary: `docs/capability-manifest-v0.9.md`
- Valid manifest fixture: `conformance/fixtures/v0.9/valid/capability-manifest-core-profiles.json`

## 7. Standards Crosswalk Summary

- Human overview: `docs/standards-mapping-v0.9.md`
- Structured artifacts: `docs/standards-crosswalk-matrix-v0.9.json`, `docs/source-system-mapping-guidance-v0.9.json`, `docs/transformation-loss-register-v0.9.json`, `docs/profile-applicability-matrix-v0.9.json`, `docs/standards-claims-matrix-v0.9.json`
- Crosswalk posture: field-level and qualified, with maturity, limitations, and profile dependency called out explicitly.

## 8. BigQuery Reference Architecture Summary

- Reference architecture: `docs/bigquery-reference-architecture-v0.9.md`
- Typed reference DDL: `reference-implementation/bigquery/schema.sql`
- Example queries: `reference-implementation/bigquery/example-queries.sql`
- Boundary: provider-specific, non-normative, statically validated only.

## 9. ServiceNow Coexistence Summary

- Coexistence summary: `docs/servicenow-coexistence.md`
- Formal serving profile: `docs/servicenow-serving-projection-profile-v0.9.md`
- Boundary: ServiceNow remains a system of action and workflow consumer, not the canonical industrial evidence layer.

## 10. Industry-Profile Index

- Industry profile index: `docs/industry-profile-index-v0.9.md`
- Profiles included now: process manufacturing, discrete manufacturing, utilities and electric power, water and wastewater, facilities and data centers.

## 11. Claims Matrix

### Safe To State Now

- SSOM is a candidate OT semantic specification with executable conformance evidence and governance artifacts.
- SSOM is a standards-aware interoperability model with qualified, field-level crosswalks.
- SSOM is an AI-ready operational context model with explicit truth-state, evidence, quality, and lineage semantics.
- SSOM includes a cloud-scale reference architecture for BigQuery as an informative, provider-specific example.
- SSOM includes reliability and work-outcome semantics with verification-aware outcomes.
- SSOM includes a bounded ServiceNow coexistence and serving-projection model.

### Safe Only With Profile Qualification

- SSOM supports functional-safety context and traceability when the bounded safety foundation profile is cited.
- SSOM supports OT cybersecurity context and topology when the bounded cyber foundation profile is cited.
- SSOM supports industry-specific deployment guidance when the corresponding industry profile scaffold is cited.
- SSOM supports cross-vendor industrial semantic layering when claims remain qualified by implemented profiles and known exclusions.

### Not Safe Yet

- Formal compliance, certification, or full-profile completeness against IEC 61511, IEC 62443, ISA-95, ISA-88, or B2MML.
- Complete vertical vocabulary libraries for each targeted industry.
- A finalized multi-vendor implementation test suite beyond the repository’s current fixture corpus.

## 12. Known Limitations And Roadmap

- Industry profiles are initial bounded scaffolds, not exhaustive vertical vocabularies.
- BigQuery architecture is statically validated only; live runtime validation is not included in this repository.
- Safety and cyber profiles are intentionally foundational and do not provide full management-system or lifecycle coverage.
- Additional P1 work includes richer industry-specific end-to-end bundles, broader interoperability proofs, and independent external review feedback incorporation.

## 13. Contributor And External-Review Guidance

- Review the RFCs, schemas, conformance fixtures, capability manifest, and standards-mapping artifacts before proposing scope changes.
- Evaluate claims against executable evidence, not narrative alone.
- Treat industry profiles and provider-specific reference architectures as bounded extensions layered on the core semantic contract.
- Submit issues or pull requests with scope, evidence, compatibility impact, and proposed fixtures.

## 14. IP And Licensing Boundary Statement

- Repository license: Apache License 2.0.
- SSOM public artifacts define shared semantic meaning and conformance surfaces, not proprietary source payloads, vendor scoring models, or closed workflow internals.
- External implementations may remain proprietary while still referencing the public semantic contract, provided claims stay consistent with repository-proven evidence.