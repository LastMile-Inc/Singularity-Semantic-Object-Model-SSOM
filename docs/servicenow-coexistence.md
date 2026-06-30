# SSOM and ServiceNow Coexistence

SSOM does not require ServiceNow CMDB or CSDM to become a complete industrial semantic model. ServiceNow can remain the workflow and system-of-action layer, while SSOM provides the canonical industrial asset, identity continuity, equipment, device, relationship, evidence, condition, and operational-intelligence context.

## Mapping guidance

| ServiceNow Construct | SSOM Interpretation |
| --- | --- |
| CMDB CI sys_id or CI number | External identifier assignment, not canonical SSOM identity |
| Equipment Model Entity | Functional or operational hierarchy node, such as site, area, line, unit, or equipment structure |
| OT Device CI | Asset with Device-oriented operational roles |
| Physical equipment CI or EAM asset | Asset with Equipment-oriented operational roles |
| PLC, HMI, VFD, RTU, sensor, gateway | Device Asset, potentially also maintainable, cyber-managed, and or Equipment-classified |
| Pump, compressor, chiller, conveyor, robot, boiler | Equipment Asset, potentially also Device-classified if smart, addressable, control-capable, or networked |
| Relationship between device and equipment | Explicit SSOM relationship such as controls, measures, actuates, protects, communicates_with, is_installed_on, or is_part_of |

## Coexistence principles

- ServiceNow identifiers, CI classes, and workflow records may appear in SSOM provenance or source-specific classification assertions.
- ServiceNow CI identifiers should be preserved as time-bound external identifier assignments with source authority and scope.
- SSOM does not require a one-to-one mapping between ServiceNow class hierarchies and SSOM operational roles.
- A single SSOM Asset may consolidate evidence from CMDB, EAM, historian, control-system, and cybersecurity sources.
- A replacement Asset may retain the same ServiceNow-facing tag, CI display name, or functional location while remaining a different canonical SSOM Asset.
- Smart operational assets such as PLCs, VFDs, and robot cells may be represented as both Equipment and Device in SSOM even when upstream platforms separate those concerns.

## Prompt 8 crosswalk reference

- Structured ServiceNow projection guidance now lives in `docs/source-system-mapping-guidance-v0.9.json` under the `servicenow-cmdb` mapping patterns.