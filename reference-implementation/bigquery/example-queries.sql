-- SSOM v0.3 example queries for overlapping equipment and device role classification

SELECT
	asset_id,
	display_name,
	asset_form,
	equipment_roles,
	device_roles,
	lifecycle_roles
FROM `ssom_core.assets`
WHERE 'process_equipment' IN UNNEST(equipment_roles);

SELECT
	asset_id,
	display_name,
	primary_operational_role,
	equipment_roles,
	device_roles
FROM `ssom_core.assets`
WHERE ARRAY_LENGTH(equipment_roles) > 0
	AND ARRAY_LENGTH(device_roles) > 0;

SELECT
	relationship_type,
	from_ref,
	to_ref,
	relationship_context
FROM `ssom_core.relationships`
WHERE relationship_type IN ('controls', 'measures', 'actuates', 'protects', 'communicates_with');
