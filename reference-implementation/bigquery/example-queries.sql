-- SSOM BigQuery reference queries v0.9
--
-- These queries assume the layered reference architecture from schema.sql.
-- Adapt dataset names, project qualifiers, and regional deployment choices before runtime use.

-- Condition trend by asset
SELECT
	o.tenant_id,
	o.site_id,
	o.canonical_asset_id,
	o.measurement_type,
	TIMESTAMP_TRUNC(o.event_time, HOUR) AS event_hour,
	AVG(o.canonical_numeric_value) AS avg_canonical_value,
	MAX(c.latest_severity_code) AS latest_condition_severity
FROM `ssom_canonical.observation_facts` AS o
LEFT JOIN `ssom_curated_oi.condition_projection_daily` AS c
	ON o.tenant_id = c.tenant_id
	AND o.site_id = c.site_id
	AND o.canonical_asset_id = c.canonical_asset_id
	AND DATE(o.event_time) = c.projection_date
WHERE o.tenant_id = @tenant_id
	AND o.site_id = @site_id
	AND o.canonical_asset_id = @canonical_asset_id
	AND o.measurement_type = @measurement_type
	AND o.event_time BETWEEN @window_start AND @window_end
GROUP BY 1, 2, 3, 4, 5
ORDER BY event_hour;

-- Cross-site peer comparison
SELECT
	f.feature_date,
	f.site_id,
	f.asset_class_id,
	f.measurement_type,
	AVG(f.latest_effectiveness_score) AS avg_effectiveness_score,
	AVG(p.avg_canonical_value) AS peer_avg_canonical_value,
	AVG(p.p95_canonical_value) AS peer_p95_canonical_value
FROM `ssom_ai.asset_feature_daily` AS f
JOIN `ssom_curated_oi.asset_peer_baseline_weekly` AS p
	ON f.tenant_id = p.tenant_id
	AND f.organization_id = p.organization_id
	AND f.site_id = p.site_id
	AND f.asset_class_id = p.asset_class_id
	AND f.measurement_type = p.measurement_type
	AND DATE_TRUNC(f.feature_date, WEEK(MONDAY)) = p.cohort_week
WHERE f.tenant_id = @tenant_id
	AND f.organization_id = @organization_id
	AND f.asset_class_id = @asset_class_id
	AND f.measurement_type = @measurement_type
	AND f.feature_date BETWEEN @window_start_date AND @window_end_date
GROUP BY 1, 2, 3, 4
ORDER BY feature_date, site_id;

-- Action-to-outcome effectiveness
SELECT
	m.tenant_id,
	m.site_id,
	m.canonical_asset_id,
	m.work_id,
	m.action_id,
	m.outcome_id,
	m.effectiveness_disposition,
	m.effectiveness_score,
	o.outcome_disposition,
	o.observed_at
FROM `ssom_curated_oi.maintenance_effectiveness_fact` AS m
JOIN `ssom_canonical.outcome_facts` AS o
	ON m.tenant_id = o.tenant_id
	AND m.site_id = o.site_id
	AND m.outcome_id = o.outcome_id
WHERE m.tenant_id = @tenant_id
	AND m.site_id = @site_id
	AND m.evaluation_window_end BETWEEN @window_start AND @window_end
ORDER BY o.observed_at DESC;

-- Late-arriving correction handling
SELECT
	current_fact.observation_id,
	current_fact.canonical_asset_id,
	current_fact.event_time,
	current_fact.ingest_time,
	current_fact.canonical_numeric_value,
	prior_fact.observation_fact_id AS corrected_fact_id,
	prior_fact.canonical_numeric_value AS prior_canonical_numeric_value,
	current_fact.correction_of_fact_id,
	current_fact.supersedes_fact_id,
	current_fact.superseded_by_fact_id
FROM `ssom_canonical.observation_facts` AS current_fact
LEFT JOIN `ssom_canonical.observation_facts` AS prior_fact
	ON current_fact.correction_of_fact_id = prior_fact.observation_fact_id
WHERE current_fact.tenant_id = @tenant_id
	AND current_fact.site_id = @site_id
	AND current_fact.canonical_asset_id = @canonical_asset_id
	AND current_fact.ingest_time > current_fact.event_time
	AND current_fact.event_time BETWEEN @window_start AND @window_end
ORDER BY current_fact.event_time, current_fact.ingest_time;

-- ServiceNow serving projection
SELECT
	canonical_asset_id,
	ci_sys_id,
	ci_class_name,
	display_name,
	install_status,
	operational_status,
	latest_condition_code,
	latest_severity_code,
	last_refresh_time
FROM `ssom_serving.servicenow_ci_projection`
WHERE tenant_id = @tenant_id
	AND site_id = @site_id
	AND last_refresh_time >= @refresh_cutoff
ORDER BY last_refresh_time DESC, canonical_asset_id;

-- AI retrieval context
SELECT
	canonical_asset_id,
	evidence_time,
	measurement_type,
	canonical_numeric_value,
	canonical_unit_code,
	event_category,
	alarm_state,
	latest_condition_code,
	latest_severity_code
FROM `ssom_ai.retrieval_context_v`
WHERE tenant_id = @tenant_id
	AND site_id = @site_id
	AND canonical_asset_id = @canonical_asset_id
	AND evidence_time >= @window_start
ORDER BY evidence_time DESC
LIMIT 200;
