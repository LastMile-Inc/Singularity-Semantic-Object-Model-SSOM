# Reproducibility Checklist v1.0

- Confirm the repository commit hash is recorded.
- Confirm the target project is non-production.
- Confirm datasets contain only synthetic, masked, or safe validation data.
- Confirm the SQL file revision or hash is recorded.
- Confirm all query job IDs are captured.
- Confirm projection-boundary failures are recorded verbatim if any prohibited payload classes appear.
- Confirm comparability-exclusion evidence is captured for ineligible site inputs.
- Confirm outcome-feedback lineage evidence is captured.
- Confirm any runtime metrics are copied from actual BigQuery job metadata rather than invented estimates.