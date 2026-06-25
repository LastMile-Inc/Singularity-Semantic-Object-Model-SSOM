-- SSOM v0.2 analytical warehouse reference implementation
-- This schema is illustrative. It stores semantic operational facts only.
-- Application-specific users, workflow state, dashboard layouts, credentials,
-- billing, and deployment configuration intentionally do not belong here.

CREATE SCHEMA IF NOT EXISTS `ssom_core`
OPTIONS(location = "US");

CREATE TABLE IF NOT EXISTS `ssom_core.assets` (
  asset_id STRING NOT NULL,
  ssom_version STRING NOT NULL,
  asset_type STRING NOT NULL,
  display_name STRING NOT NULL,
  lifecycle_state STRING NOT NULL,
  identity JSON NOT NULL,
  context JSON,
  extensions JSON,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  recorded_at TIMESTAMP NOT NULL
)
PARTITION BY DATE(recorded_at)
CLUSTER BY asset_id, asset_type;

CREATE TABLE IF NOT EXISTS `ssom_core.relationships` (
  relationship_id STRING NOT NULL,
  relationship_type STRING NOT NULL,
  from_ref STRING NOT NULL,
  to_ref STRING NOT NULL,
  valid_from TIMESTAMP,
  valid_to TIMESTAMP,
  confidence FLOAT64,
  provenance JSON NOT NULL,
  extensions JSON,
  recorded_at TIMESTAMP NOT NULL
)
PARTITION BY DATE(recorded_at)
CLUSTER BY from_ref, to_ref, relationship_type;

CREATE TABLE IF NOT EXISTS `ssom_core.operational_records` (
  record_id STRING NOT NULL,
  record_type STRING NOT NULL,
  ssom_version STRING NOT NULL,
  subject_ref STRING NOT NULL,
  event_time TIMESTAMP NOT NULL,
  priority_class STRING,
  payload JSON,
  provenance JSON NOT NULL,
  quality JSON NOT NULL,
  temporal_integrity JSON NOT NULL,
  policy_evidence JSON,
  correlation_id STRING,
  causation_id STRING,
  trace_id STRING,
  extensions JSON
)
PARTITION BY DATE(event_time)
CLUSTER BY subject_ref, record_type, priority_class;

CREATE TABLE IF NOT EXISTS `ssom_core.conditions` (
  condition_id STRING NOT NULL,
  ssom_version STRING NOT NULL,
  condition_type STRING NOT NULL,
  subject_ref STRING NOT NULL,
  lifecycle_state STRING NOT NULL,
  severity STRING NOT NULL,
  confidence FLOAT64,
  detected_at TIMESTAMP NOT NULL,
  evidence_refs ARRAY<STRING>,
  provenance JSON NOT NULL,
  quality_summary JSON NOT NULL,
  policy_evidence JSON,
  extensions JSON,
  recorded_at TIMESTAMP NOT NULL
)
PARTITION BY DATE(detected_at)
CLUSTER BY subject_ref, condition_type, lifecycle_state, severity;
