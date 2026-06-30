# SSOM v0.9 Schema Reference

## Boundary and relationship schemas

| Schema | Purpose | Required anchors |
| --- | --- | --- |
| `schemas/jsonschema/asset-class.json` | Governed taxonomy or class concept for assets | `class_id`, `display_name`, `class_scheme`, `class_code` |
| `schemas/jsonschema/equipment-model.json` | Governed manufacturer or design model concept | `model_id`, `display_name`, `manufacturer_name`, `model_code` |
| `schemas/jsonschema/operational-boundary.json` | Non-serialized operational boundary such as system, process segment, production unit, or control entity | `boundary_id`, `boundary_type`, `display_name` |
| `schemas/jsonschema/relationship.json` | Governed, time-aware relationship between SSOM entities | `relationship_id`, `relationship_type`, `from_ref`, `to_ref`, `provenance`, `confidence` |
| `schemas/jsonschema/relationship-registry.json` | Schema for the machine-readable core relationship registry | `registry_name`, `ssom_version`, `entries[]` |

## Machine-readable registry

The governed relationship vocabulary is published in `schemas/registry/core-relationship-vocabulary.json`.

Each registry entry defines:

- canonical code
- label
- inverse code
- relationship family
- permitted subject types
- permitted object types
- direction
- cardinality guidance
- temporal validity guidance
- profile applicability
- alias and deprecation behavior

## Compatibility notes

- Existing v0.8 event and alarm fixtures remain valid.
- Existing v0.7 reliability and work fixtures remain valid.
- Existing v0.6 measurement-safety fixtures remain valid.
- Existing v0.5 identity lifecycle fixtures remain valid.
- Existing v0.3 Asset, Relationship, Observation, and Condition fixtures remain valid.