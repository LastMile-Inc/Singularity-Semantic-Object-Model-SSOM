-- SSOM BigQuery reference-validation queries
-- Non-production only. Replace the declared identifiers with safe test datasets.

DECLARE target_project STRING DEFAULT 'nonprod-project';
DECLARE raw_dataset STRING DEFAULT 'ssom_raw_nonprod';
DECLARE canonical_dataset STRING DEFAULT 'ssom_canonical_nonprod';
DECLARE serving_dataset STRING DEFAULT 'ssom_serving_nonprod';
DECLARE ai_dataset STRING DEFAULT 'ssom_ai_nonprod';

-- 1. Rebuildability: canonical facts should be sufficient to recreate current serving rows.
SELECT
  COUNT(*) AS current_projection_rows
FROM `${target_project}.${serving_dataset}.serving_projection_current`;

SELECT
  COUNT(*) AS canonical_fact_rows
FROM `${target_project}.${canonical_dataset}.canonical_fact_history`;

-- 2. Projection boundary: raw evidence classes must not appear in workflow-facing projections.
SELECT
  projection_class,
  COUNT(*) AS class_count
FROM `${target_project}.${serving_dataset}.serving_projection_current`
GROUP BY projection_class
HAVING projection_class IN ('raw_historian_samples', 'high_frequency_telemetry', 'raw_opcua_payloads');

-- 3. Comparability boundary: ineligible benchmark evidence must stay excluded.
SELECT
  assessment_id,
  comparable_view_eligible,
  COUNT(*) AS record_count
FROM `${target_project}.${ai_dataset}.comparability_inputs`
GROUP BY assessment_id, comparable_view_eligible;

-- 4. Outcome feedback lineage: recommendation through outcome must remain reconstructable.
SELECT
  recommendation_id,
  work_execution_id,
  work_verification_id,
  work_outcome_id
FROM `${target_project}.${canonical_dataset}.work_outcome_lineage`
WHERE recommendation_id IS NOT NULL;

-- 5. Runtime capture reminder: actual latency, slot usage, and bytes processed must be recorded from job metadata after execution.