# SSOM Relationship Vocabulary v0.9

## Purpose

This document explains the governed relationship vocabulary introduced in SSOM v0.9. The normative machine-readable registry is `schemas/registry/core-relationship-vocabulary.json`.

## Core rules

- Core relationship semantics must use governed relationship codes.
- Core relationship use must not fall back to unrestricted free text.
- Extension relationships must be namespaced and retain mapping metadata plus provenance.
- Known inverse pairs must remain governed rather than improvised in each integration.
- Subject and object domain validity is part of conformance, not only JSON shape validation.

## Families covered by the registry

- Composition and containment
- Installation and hosting
- Connectivity and communication
- Control, measurement, monitoring, actuation, and protection
- Mechanical drive, power, and process flow
- Support and operational context
- Condition, failure, and work-effect semantics
- Succession and replacement semantics

## Boundary guidance

- A System, Subsystem, Functional System, Process Segment, Production Unit, or Control Entity is not automatically a serialized Asset.
- A Functional Location is not an Asset.
- An Asset Class is not an Asset instance.
- An Equipment Model is not an Asset instance.
- A composite system is not the same thing as each constituent asset, even if an organization also manages the composite as an Asset in a separate lifecycle context.

## When an extension should become core

An extension relationship becomes a candidate core relationship when:

- multiple independent sources use the same semantics;
- the meaning is stable across products and deployments;
- the relationship cannot already be expressed by an existing core term or alias; and
- the proposed term includes clear inverse, domain, and temporal guidance.