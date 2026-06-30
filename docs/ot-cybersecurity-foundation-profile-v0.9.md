# SSOM OT Cybersecurity Foundation Profile v0.9

## Purpose

This profile adds a limited OT cybersecurity foundation for asset identity, firmware and software identity, network and protocol context, zone and conduit topology, vulnerability references, posture references, mitigation action, and cyber event traceability.

It does not claim IEC 62443 compliance or a complete cybersecurity management implementation.

## Supported scope

- Cyber-managed Asset.
- Firmware and software identity.
- Protocol and communications context.
- Network identity.
- Zone.
- Conduit.
- Exposure or vulnerability reference.
- Security state or posture reference.
- Patch or mitigation action.
- Cyber event.
- Relationship between Device, Network, Zone, Conduit, and operational equipment.

## Profile rules

- Cyber context extends the canonical asset and relationship model rather than replacing it.
- Firmware, software, posture, and vulnerability references remain explicit and typed.
- Zones and conduits remain bounded context surfaces, not a claim of complete control-framework modeling.
- Mitigation action may be represented, but full policy, governance, and compliance programs remain external.

## Fixtures and validation

- Schema: `schemas/jsonschema/cyber-foundation-bundle.json`
- Fixture: `conformance/fixtures/v0.9/valid/cyber-foundation-bundle-zone-conduit-assets.json`
- Covered scenarios: a networked VFD with vulnerable firmware, a PLC in a zone communicating through a conduit, and a safety controller with cyber-managed identity.

## Boundary statement

This profile supports foundational asset, identity, relationship, and context semantics useful for OT cyber interoperability. It does not convert SSOM into a complete cybersecurity management product.