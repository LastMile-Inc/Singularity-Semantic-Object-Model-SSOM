# SSOM v0.3 Migration Guide

SSOM v0.3.0 is an additive, backward-compatible release relative to the v0.2 draft.

## Migration summary

1. Existing Assets remain valid.
2. Existing asset classes may be mapped to Equipment roles, Device roles, Lifecycle roles, or combinations of these.
3. Existing source-specific types must be retained as source assertions or source metadata.
4. Existing integrations should not assume Equipment and Device are mutually exclusive.
5. Existing consumers can continue using Assets without immediately adopting the new role fields.
6. Validation and profile logic should prevent schemas, profiles, and consumers from treating Equipment and Device as disjoint categories.

## Recommended migration steps

1. Preserve existing `asset_id` values and identity evidence.
2. Add `asset_form` where source evidence or mapping rules support it.
3. Add `equipment_roles[]`, `device_roles[]`, and `lifecycle_roles[]` as optional projections.
4. Record governed evidence in `classification_assertions[]` when provenance, timing, or derivation traceability matters.
5. Retain vendor or source types using `classification_category = source_type` or equivalent source metadata.
6. Update relationship mappings so control, measurement, actuation, protection, and communications links are explicit.

## Mapping guidance

| Existing or Source Type | Suggested SSOM Asset Form | Equipment Role | Device Role | Lifecycle Role |
| --- | --- | --- | --- | --- |
| Centrifugal pump | machine | process_equipment | none by default | serialized_asset, maintainable_asset, monitored_asset |
| Pressure transmitter | instrument | none by default | sensing_device, measurement_device | serialized_asset, monitored_asset, cyber_managed_asset where applicable |
| PLC | controller | none by default | control_device, compute_device | serialized_asset, maintainable_asset, cyber_managed_asset |
| VFD | controller or assembly | utility_equipment or process_equipment where applicable | control_device, actuation_device | serialized_asset, maintainable_asset, cyber_managed_asset |
| Smart pump | machine | process_equipment | sensing_device and control_device where applicable | serialized_asset, maintainable_asset, monitored_asset, cyber_managed_asset |
| Robot cell | system or machine | production_equipment | control_device where applicable | serialized_asset, maintainable_asset, critical_asset |

## Compatibility statement

- **Status:** Fully backward-compatible and additive.
- **Migration warnings:** Consumers that hard-code Equipment and Device as mutually exclusive categories require logic updates.
- **Breaking changes:** None in the normative JSON Schemas for legacy-conformant Asset payloads.