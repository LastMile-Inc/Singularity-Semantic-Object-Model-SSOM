-- SSOM BigQuery reference architecture v0.9
--
-- This file is a provider-specific reference implementation example only.
-- It does not define the SSOM semantic contract.
-- Maintained normative semantics remain the RFCs, JSON Schemas, governed registries,
-- and executable conformance fixtures.
--
-- Design intent:
-- 1. Preserve raw evidence separately from canonical semantic facts.
-- 2. Keep workflow-serving projections separate from canonical fact history.
-- 3. Keep AI feature and evaluation datasets separate from both raw evidence and serving projections.
-- 4. Use typed columns for frequently queried fields rather than JSON-first access patterns.
-- 5. Preserve corrected and superseded facts through append-preserving lineage columns.

CREATE SCHEMA IF NOT EXISTS `ssom_raw_evidence`
OPTIONS(
	location = "US",
	description = "Raw Evidence Layer: immutable or append-preserving source payloads, raw telemetry, source events, and ingestion metadata."
);

CREATE SCHEMA IF NOT EXISTS `ssom_canonical`
OPTIONS(
	location = "US",
	description = "Canonical SSOM Layer: typed normalized Asset, Identifier Assignment, Relationship, Observation, Event, Alarm, Condition, Failure, Work, Recommendation, Decision, Action, and Outcome facts."
);

CREATE SCHEMA IF NOT EXISTS `ssom_curated_oi`
OPTIONS(
	location = "US",
	description = "Curated Operational Intelligence Layer: governed derived cohorts, metrics, correlations, and comparative operational intelligence."
);

CREATE SCHEMA IF NOT EXISTS `ssom_serving`
OPTIONS(
	location = "US",
	description = "Serving Projection Layer: workflow and API optimized projections for ServiceNow, EAM, dashboards, mobile, and operational applications."
);

CREATE SCHEMA IF NOT EXISTS `ssom_ai`
OPTIONS(
	location = "US",
	description = "AI Feature and Evaluation Layer: feature tables, retrieval views, evaluation sets, labels, and feedback loops."
);

-- Raw Evidence Layer
-- Append-preserving by contract.

CREATE TABLE IF NOT EXISTS `ssom_raw_evidence.telemetry_ingest_raw` (
	source_event_id STRING NOT NULL,
	source_system_id STRING NOT NULL,
	source_object_id STRING NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	event_time TIMESTAMP NOT NULL,
	ingest_time TIMESTAMP NOT NULL,
	processed_time TIMESTAMP,
	source_schema_ref STRING,
	source_payload_format STRING,
	original_quantity_kind STRING,
	original_unit_code STRING,
	original_quality_code STRING,
	canonical_asset_id STRING,
	ingestion_run_id STRING,
	backfill_run_id STRING,
	source_snapshot_ref STRING,
	source_payload JSON NOT NULL
)
PARTITION BY DATE(event_time)
CLUSTER BY tenant_id, site_id, source_system_id, source_object_id;

CREATE TABLE IF NOT EXISTS `ssom_raw_evidence.source_event_raw` (
	source_event_id STRING NOT NULL,
	source_system_id STRING NOT NULL,
	source_event_type STRING NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	event_time TIMESTAMP NOT NULL,
	ingest_time TIMESTAMP NOT NULL,
	processed_time TIMESTAMP,
	canonical_asset_id STRING,
	source_schema_ref STRING,
	source_payload JSON NOT NULL,
	ingestion_run_id STRING,
	backfill_run_id STRING
)
PARTITION BY DATE(event_time)
CLUSTER BY tenant_id, site_id, source_system_id, source_event_type;

-- Canonical SSOM Layer
-- Asset and relationship history can be modeled as slowly changing semantic facts.
-- Observations, events, alarms, decisions, actions, and outcomes are append-preserving fact histories.

CREATE TABLE IF NOT EXISTS `ssom_canonical.asset_facts` (
	asset_fact_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	asset_class_id STRING,
	equipment_model_id STRING,
	functional_location_id STRING,
	asset_form STRING,
	lifecycle_state STRING,
	effective_from TIMESTAMP NOT NULL,
	effective_to TIMESTAMP,
	recorded_at TIMESTAMP NOT NULL,
	is_current BOOL NOT NULL,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	source_event_id STRING,
	transformation_version STRING NOT NULL,
	source_payload_ref STRING
)
PARTITION BY DATE(recorded_at)
CLUSTER BY tenant_id, site_id, canonical_asset_id, asset_class_id;

CREATE TABLE IF NOT EXISTS `ssom_canonical.identifier_assignment_facts` (
	assignment_fact_id STRING NOT NULL,
	assignment_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	identifier_value STRING NOT NULL,
	identifier_role STRING NOT NULL,
	assigning_authority STRING NOT NULL,
	identifier_scope STRING NOT NULL,
	valid_from TIMESTAMP NOT NULL,
	valid_to TIMESTAMP,
	recorded_at TIMESTAMP NOT NULL,
	is_current BOOL NOT NULL,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(recorded_at)
CLUSTER BY tenant_id, site_id, canonical_asset_id, identifier_role;

CREATE TABLE IF NOT EXISTS `ssom_canonical.relationship_facts` (
	relationship_fact_id STRING NOT NULL,
	relationship_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	from_entity_id STRING NOT NULL,
	from_entity_kind STRING NOT NULL,
	to_entity_id STRING NOT NULL,
	to_entity_kind STRING NOT NULL,
	relationship_type STRING NOT NULL,
	relationship_family STRING,
	valid_from TIMESTAMP NOT NULL,
	valid_to TIMESTAMP,
	recorded_at TIMESTAMP NOT NULL,
	is_current BOOL NOT NULL,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(recorded_at)
CLUSTER BY tenant_id, site_id, from_entity_id, relationship_type;

CREATE TABLE IF NOT EXISTS `ssom_canonical.observation_facts` (
	observation_fact_id STRING NOT NULL,
	observation_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	source_event_id STRING NOT NULL,
	event_time TIMESTAMP NOT NULL,
	ingest_time TIMESTAMP NOT NULL,
	processed_time TIMESTAMP NOT NULL,
	measurement_type STRING NOT NULL,
	quantity_kind STRING,
	original_numeric_value FLOAT64,
	original_unit_code STRING,
	canonical_numeric_value FLOAT64,
	canonical_unit_code STRING,
	quality_state STRING,
	calibration_state STRING,
	comparable_view_eligible BOOL,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL,
	source_payload_ref STRING
)
PARTITION BY DATE(event_time)
CLUSTER BY tenant_id, site_id, canonical_asset_id, measurement_type;

CREATE TABLE IF NOT EXISTS `ssom_canonical.event_facts` (
	event_fact_id STRING NOT NULL,
	event_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	source_event_id STRING NOT NULL,
	event_time TIMESTAMP NOT NULL,
	ingest_time TIMESTAMP NOT NULL,
	processed_time TIMESTAMP NOT NULL,
	event_category STRING NOT NULL,
	event_severity STRING,
	source_state STRING,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL,
	source_payload_ref STRING
)
PARTITION BY DATE(event_time)
CLUSTER BY tenant_id, site_id, canonical_asset_id, event_category;

CREATE TABLE IF NOT EXISTS `ssom_canonical.alarm_facts` (
	alarm_fact_id STRING NOT NULL,
	alarm_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	event_time TIMESTAMP NOT NULL,
	ingest_time TIMESTAMP NOT NULL,
	processed_time TIMESTAMP NOT NULL,
	alarm_state STRING NOT NULL,
	severity_code STRING,
	threshold_name STRING,
	suppression_state STRING,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL,
	source_payload_ref STRING
)
PARTITION BY DATE(event_time)
CLUSTER BY tenant_id, site_id, canonical_asset_id, alarm_state;

CREATE TABLE IF NOT EXISTS `ssom_canonical.condition_facts` (
	condition_fact_id STRING NOT NULL,
	condition_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	condition_code STRING NOT NULL,
	severity_code STRING,
	effective_from TIMESTAMP NOT NULL,
	effective_to TIMESTAMP,
	recorded_at TIMESTAMP NOT NULL,
	is_current BOOL NOT NULL,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(recorded_at)
CLUSTER BY tenant_id, site_id, canonical_asset_id, condition_code;

CREATE TABLE IF NOT EXISTS `ssom_canonical.failure_facts` (
	failure_fact_id STRING NOT NULL,
	failure_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	failure_mode_code STRING,
	failure_mechanism_code STRING,
	failure_cause_code STRING,
	event_time TIMESTAMP NOT NULL,
	recorded_at TIMESTAMP NOT NULL,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(event_time)
CLUSTER BY tenant_id, site_id, canonical_asset_id, failure_mode_code;

CREATE TABLE IF NOT EXISTS `ssom_canonical.work_facts` (
	work_fact_id STRING NOT NULL,
	work_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	work_stage STRING NOT NULL,
	work_status STRING NOT NULL,
	work_type STRING,
	event_time TIMESTAMP,
	recorded_at TIMESTAMP NOT NULL,
	source_work_order_id STRING,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(recorded_at)
CLUSTER BY tenant_id, site_id, canonical_asset_id, work_status;

CREATE TABLE IF NOT EXISTS `ssom_canonical.recommendation_facts` (
	recommendation_fact_id STRING NOT NULL,
	recommendation_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	recommendation_type STRING NOT NULL,
	priority_code STRING,
	recommended_at TIMESTAMP NOT NULL,
	recorded_at TIMESTAMP NOT NULL,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(recommended_at)
CLUSTER BY tenant_id, site_id, canonical_asset_id, recommendation_type;

CREATE TABLE IF NOT EXISTS `ssom_canonical.decision_facts` (
	decision_fact_id STRING NOT NULL,
	decision_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	decision_status STRING NOT NULL,
	decision_authority STRING,
	decided_at TIMESTAMP NOT NULL,
	recorded_at TIMESTAMP NOT NULL,
	recommendation_id STRING,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(decided_at)
CLUSTER BY tenant_id, site_id, canonical_asset_id, decision_status;

CREATE TABLE IF NOT EXISTS `ssom_canonical.action_facts` (
	action_fact_id STRING NOT NULL,
	action_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	action_type STRING NOT NULL,
	action_status STRING NOT NULL,
	executed_at TIMESTAMP,
	recorded_at TIMESTAMP NOT NULL,
	decision_id STRING,
	work_id STRING,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(recorded_at)
CLUSTER BY tenant_id, site_id, canonical_asset_id, action_type;

CREATE TABLE IF NOT EXISTS `ssom_canonical.outcome_facts` (
	outcome_fact_id STRING NOT NULL,
	outcome_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	fact_version INT64 NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	region_code STRING NOT NULL,
	outcome_disposition STRING NOT NULL,
	observed_at TIMESTAMP NOT NULL,
	recorded_at TIMESTAMP NOT NULL,
	action_id STRING,
	work_id STRING,
	correction_of_fact_id STRING,
	supersedes_fact_id STRING,
	superseded_by_fact_id STRING,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(observed_at)
CLUSTER BY tenant_id, site_id, canonical_asset_id, outcome_disposition;

-- Curated Operational Intelligence Layer
-- Rebuildable derived tables for repeated analytical access.

CREATE TABLE IF NOT EXISTS `ssom_curated_oi.condition_projection_daily` (
	projection_date DATE NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	asset_class_id STRING,
	measurement_type STRING,
	latest_condition_code STRING,
	latest_severity_code STRING,
	latest_canonical_value FLOAT64,
	comparable_observation_count INT64,
	transformation_version STRING NOT NULL
)
PARTITION BY projection_date
CLUSTER BY tenant_id, site_id, canonical_asset_id, measurement_type;

CREATE TABLE IF NOT EXISTS `ssom_curated_oi.asset_peer_baseline_weekly` (
	cohort_week DATE NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	asset_class_id STRING NOT NULL,
	measurement_type STRING NOT NULL,
	peer_asset_count INT64 NOT NULL,
	avg_canonical_value FLOAT64,
	p95_canonical_value FLOAT64,
	transformation_version STRING NOT NULL
)
PARTITION BY cohort_week
CLUSTER BY tenant_id, site_id, asset_class_id, measurement_type;

CREATE TABLE IF NOT EXISTS `ssom_curated_oi.maintenance_effectiveness_fact` (
	effectiveness_fact_id STRING NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	work_id STRING NOT NULL,
	action_id STRING,
	outcome_id STRING,
	baseline_window_start TIMESTAMP,
	baseline_window_end TIMESTAMP,
	evaluation_window_start TIMESTAMP,
	evaluation_window_end TIMESTAMP,
	effectiveness_disposition STRING NOT NULL,
	effectiveness_score FLOAT64,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(evaluation_window_end)
CLUSTER BY tenant_id, site_id, canonical_asset_id, effectiveness_disposition;

CREATE TABLE IF NOT EXISTS `ssom_curated_oi.event_correlation_fact` (
	correlation_fact_id STRING NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	event_time TIMESTAMP NOT NULL,
	correlation_group_id STRING NOT NULL,
	primary_event_category STRING NOT NULL,
	related_alarm_count INT64,
	related_observation_count INT64,
	transformation_version STRING NOT NULL
)
PARTITION BY DATE(event_time)
CLUSTER BY tenant_id, site_id, canonical_asset_id, primary_event_category;

CREATE VIEW IF NOT EXISTS `ssom_curated_oi.asset_graph_edges_current` AS
SELECT
	tenant_id,
	organization_id,
	site_id,
	from_entity_id,
	from_entity_kind,
	to_entity_id,
	to_entity_kind,
	relationship_type,
	relationship_family,
	valid_from,
	valid_to
FROM `ssom_canonical.relationship_facts`
WHERE is_current = TRUE;

-- Serving Projection Layer
-- Rebuildable workflow or API projections only.

CREATE TABLE IF NOT EXISTS `ssom_serving.servicenow_ci_projection` (
	projection_run_id STRING NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	ci_sys_id STRING,
	ci_class_name STRING,
	display_name STRING,
	install_status STRING,
	operational_status STRING,
	functional_location_id STRING,
	latest_condition_code STRING,
	latest_severity_code STRING,
	last_refresh_time TIMESTAMP NOT NULL,
	source_mapping_version STRING NOT NULL
)
PARTITION BY DATE(last_refresh_time)
CLUSTER BY tenant_id, site_id, canonical_asset_id, ci_class_name;

CREATE TABLE IF NOT EXISTS `ssom_serving.dashboard_asset_condition_current` (
	refresh_date DATE NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	asset_class_id STRING,
	latest_condition_code STRING,
	latest_severity_code STRING,
	open_alarm_count INT64,
	overdue_work_count INT64,
	last_observation_time TIMESTAMP,
	last_refresh_time TIMESTAMP NOT NULL
)
PARTITION BY refresh_date
CLUSTER BY tenant_id, site_id, canonical_asset_id, asset_class_id;

CREATE VIEW IF NOT EXISTS `ssom_serving.eam_work_order_projection_v` AS
SELECT
	work_id,
	canonical_asset_id,
	tenant_id,
	organization_id,
	site_id,
	work_stage,
	work_status,
	work_type,
	source_work_order_id,
	recorded_at
FROM `ssom_canonical.work_facts`
WHERE work_status IN ("requested", "planned", "in_progress", "completed");

-- AI Feature and Evaluation Layer
-- Rebuildable, model-facing, and evaluation-oriented datasets.

CREATE TABLE IF NOT EXISTS `ssom_ai.asset_feature_daily` (
	feature_date DATE NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	asset_class_id STRING,
	measurement_type STRING,
	observation_count_24h INT64,
	open_alarm_count_24h INT64,
	recommendation_count_30d INT64,
	completed_work_count_90d INT64,
	latest_condition_severity STRING,
	latest_effectiveness_score FLOAT64,
	feature_version STRING NOT NULL,
	label_window_end TIMESTAMP
)
PARTITION BY feature_date
CLUSTER BY tenant_id, site_id, canonical_asset_id, measurement_type;

CREATE VIEW IF NOT EXISTS `ssom_ai.retrieval_context_v` AS
SELECT
	a.canonical_asset_id,
	a.tenant_id,
	a.organization_id,
	a.site_id,
	a.asset_class_id,
	o.event_time AS evidence_time,
	o.measurement_type,
	o.canonical_numeric_value,
	o.canonical_unit_code,
	e.event_category,
	al.alarm_state,
	c.latest_condition_code,
	c.latest_severity_code
FROM `ssom_canonical.asset_facts` AS a
LEFT JOIN `ssom_canonical.observation_facts` AS o
	ON a.canonical_asset_id = o.canonical_asset_id
	AND a.tenant_id = o.tenant_id
	AND a.site_id = o.site_id
LEFT JOIN `ssom_canonical.event_facts` AS e
	ON a.canonical_asset_id = e.canonical_asset_id
	AND a.tenant_id = e.tenant_id
	AND a.site_id = e.site_id
LEFT JOIN `ssom_canonical.alarm_facts` AS al
	ON a.canonical_asset_id = al.canonical_asset_id
	AND a.tenant_id = al.tenant_id
	AND a.site_id = al.site_id
LEFT JOIN `ssom_curated_oi.condition_projection_daily` AS c
	ON a.canonical_asset_id = c.canonical_asset_id
	AND a.tenant_id = c.tenant_id
	AND a.site_id = c.site_id
WHERE a.is_current = TRUE;

CREATE TABLE IF NOT EXISTS `ssom_ai.recommendation_evaluation_labels` (
	label_id STRING NOT NULL,
	tenant_id STRING NOT NULL,
	organization_id STRING NOT NULL,
	site_id STRING NOT NULL,
	canonical_asset_id STRING NOT NULL,
	recommendation_id STRING NOT NULL,
	action_id STRING,
	outcome_id STRING,
	label_window_end TIMESTAMP NOT NULL,
	outcome_disposition STRING,
	effectiveness_score FLOAT64,
	evaluation_status STRING NOT NULL,
	feature_version STRING NOT NULL
)
PARTITION BY DATE(label_window_end)
CLUSTER BY tenant_id, site_id, canonical_asset_id, evaluation_status;
