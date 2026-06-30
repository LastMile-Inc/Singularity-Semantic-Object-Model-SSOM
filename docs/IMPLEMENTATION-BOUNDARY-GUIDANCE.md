# Implementation Boundary Guidance

SSOM defines shared operational semantics. It does not prescribe how a software product stores users, workflows, dashboard layouts, credentials, billing information, configuration, or deployment state.

A conformant implementation will commonly maintain multiple data domains:

1. **SSOM semantic facts**  
   Assets, relationships, observations, events, alarms, conditions, provenance, quality, temporal integrity, and policy evidence.

2. **Raw evidence**  
   Original payloads, files, media references, and replay artifacts.

3. **Current-state projections**  
   Derived representations optimized for operational queries.

4. **Application-private state**  
   Product-specific users, permissions, workflows, dashboards, credentials, configuration, billing, and support operations.

Application-private state may reference SSOM identifiers. It must not redefine the meaning of SSOM core objects.

SSOM v0.3.0 keeps Asset as the canonical lifecycle identity while allowing Equipment and Device to coexist as overlapping operational classifications. Workflow and system-of-action products may reference those classifications, but they do not redefine them.

For BigQuery reference implementations, keep at least five distinct data domains:

1. Raw evidence datasets for immutable or append-preserving source payloads.
2. Canonical SSOM datasets for typed semantic facts.
3. Curated operational-intelligence datasets for rebuildable governed analytics.
4. Serving datasets for workflow, API, and dashboard projections.
5. AI datasets for features, retrieval context, and evaluation labels.

Do not collapse raw telemetry, canonical facts, workflow projections, AI feature tables, and application-private product state into one shared storage surface.
