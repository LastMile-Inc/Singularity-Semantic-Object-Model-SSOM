# ADR-0001: Model Equipment and Devices as Overlapping Asset Classifications

## Context

Industrial systems use Equipment and Device differently depending on operations, maintenance, engineering, control, cybersecurity, OPC UA, ISA-95, and asset-management context. Some assets are clearly one or the other. Many modern industrial assets, including VFDs, smart pumps, robot cells, and control skids, participate in both categories at the same time.

## Decision

Asset remains the canonical lifecycle identity in SSOM. Equipment and Device are modeled as distinct, overlapping classifications of Asset rather than mutually exclusive subclasses.

## Rationale

This decision avoids false dichotomies while preserving the distinction necessary for operational intelligence, causal analysis, maintenance, reliability, cybersecurity, interoperability, and AI reasoning.

## Consequences

Positive consequences:

- Better causal reasoning.
- Better AI retrieval.
- Better reliability analysis.
- Better OT cybersecurity context.
- Better standards alignment.
- Better ServiceNow coexistence.
- Better representation of smart and converged industrial assets.

Negative consequences:

- More classification complexity.
- Need for controlled vocabulary governance.
- Need for profile-specific mappings.
- Need for provenance and temporal classification support.

## Rejected alternative

Do not model Equipment and Device as mutually exclusive subclasses of Asset.