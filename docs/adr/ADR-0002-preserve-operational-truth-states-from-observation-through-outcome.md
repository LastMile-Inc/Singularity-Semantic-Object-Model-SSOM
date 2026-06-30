# ADR-0002: Preserve Operational Truth States From Observation Through Outcome

## Context

SSOM previously modeled Assets, Relationships, Observations, and Conditions, but it did not distinguish source-attributed statements, derived assertions, reasoned interpretations, future predictions, recommendations, approvals, executed actions, and assessed outcomes. That made it too easy for implementations to collapse different truth states into one ambiguous object and silently treat recommendations, decisions, or predictions as facts.

## Decision

SSOM will preserve a semantic truth and decision lifecycle consisting of Observation, Source Assertion, Derived Assertion, Inference, Prediction, Recommendation, Decision, Action, and Outcome as distinct first-class semantic objects.

## Rationale

This decision preserves evidence chains, supports contradiction without forced reconciliation, allows correction and supersession lineage, and creates a safer foundation for later maintenance, workflow, and AI-oriented profiles.

## Consequences

Positive consequences:

- Better explainability and auditability.
- Better distinction between measured evidence and governed interpretation.
- Better support for contradiction, correction, and supersession.
- Better foundation for recommendation, approval, action, and outcome tracking.

Negative consequences:

- More semantic objects to govern.
- More fixture and conformance work required.
- Need for profile-specific specializations later, especially for Event, Alarm, work execution, and maintenance.

## Rejected alternative

Do not flatten observations, assertions, inferences, recommendations, decisions, actions, and outcomes into one generic record type with ambiguous meaning.