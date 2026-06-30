# Last Mile Platform Operations And SSOM Master Profile v1.0

## Purpose

This profile defines a proprietary Last Mile operating layer that depends on SSOM Core semantics without redefining them.

SSOM Core remains the portable semantic contract for asset identity, evidence, truth-state, relationships, work, outcome, safety, cybersecurity, and workflow-facing projections. The Last Mile platform-operations profile adds product-private control-plane, rights, master-learning, tenant-isolation, observability, and agent orchestration rules that are intentionally outside portable SSOM Core.

## What this profile covers

- multi-tenant control-plane organization;
- tenant and regional isolation domains;
- rights-management and master-learning planes;
- platform-observability and agent surfaces;
- governed bindings from proprietary operating layers to SSOM profile outputs; and
- workflow-facing control-plane rules for curated projections.

## What this profile must not do

- redefine SSOM Asset, Observation, Condition, Recommendation, Action, Outcome, or Relationship semantics;
- treat ServiceNow, control-plane state, or observability-agent state as the canonical SSOM evidence layer;
- permit raw historian samples, high-frequency telemetry, or raw OPC UA payloads to become cross-tenant shared surfaces;
- treat master-learning artifacts as portable SSOM Core semantics; or
- erase tenant boundaries merely because benchmark or AI workloads exist.

## Control-plane boundary

Tenant control planes may consume curated SSOM projections and policy-cleared benchmark outputs, but they do not replace the canonical SSOM evidence layer. Control-plane state remains proprietary product behavior.

## Rights and master-learning boundary

Rights-management and master-learning planes may govern who can view or promote benchmark, feature, or recommendation outputs. They must not inject new normative SSOM Core object definitions. Cross-tenant learning inputs require explicit approval references and may only use policy-cleared comparable views rather than raw evidence.

## Observability and agent boundary

Observability agents may expose job health, projection freshness, anomaly summaries, and curated workflow context. They must not mirror raw high-frequency evidence into shared agent surfaces.

## Fixtures and validation

- Schema: `schemas/jsonschema/last-mile-platform-operations-profile.json`
- Valid fixtures:
  - `conformance/fixtures/v1.0/valid/last-mile-platform-profile-multi-tenant-control-plane.json`
  - `conformance/fixtures/v1.0/valid/last-mile-platform-profile-master-learning-observability.json`
- Invalid fixtures:
  - `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-cross-tenant-shared-raw-evidence.json`
  - `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-master-learning-unapproved-inputs.json`
  - `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-agent-raw-evidence-mirror.json`
  - `conformance/fixtures/v1.0/invalid/last-mile-platform-profile-binding-unknown-tenant.json`

## Boundary statement

This profile is proprietary and optional. It may be released as `Last Mile Platform Operations and SSOM Master Profile v1.0.0` only if it remains explicitly distinct from portable SSOM Core and if its tenant, learning, and observability controls stay validator-backed and non-normative to the SSOM Core specification.