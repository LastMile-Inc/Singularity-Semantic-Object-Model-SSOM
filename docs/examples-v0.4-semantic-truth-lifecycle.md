# SSOM v0.4 Examples: Semantic Truth and Decision Lifecycle

This document points to the normative JSON Schema fixtures that demonstrate SSOM v0.4.0 semantic truth-state behavior.

## Pump vibration lifecycle example

Observation through Outcome chain:

1. Observation: [conformance/fixtures/v0.4/valid/observation-pump-p201-vibration-rms.json](../conformance/fixtures/v0.4/valid/observation-pump-p201-vibration-rms.json)
2. Source Assertion: [conformance/fixtures/v0.4/valid/source-assertion-pump-p201-oem-vibration-advisory.json](../conformance/fixtures/v0.4/valid/source-assertion-pump-p201-oem-vibration-advisory.json)
3. Derived Assertion: [conformance/fixtures/v0.4/valid/derived-assertion-pump-p201-vibration-trend.json](../conformance/fixtures/v0.4/valid/derived-assertion-pump-p201-vibration-trend.json)
4. Inference: [conformance/fixtures/v0.4/valid/inference-pump-p201-bearing-degradation.json](../conformance/fixtures/v0.4/valid/inference-pump-p201-bearing-degradation.json)
5. Prediction: [conformance/fixtures/v0.4/valid/prediction-pump-p201-failure-risk-14d.json](../conformance/fixtures/v0.4/valid/prediction-pump-p201-failure-risk-14d.json)
6. Recommendation: [conformance/fixtures/v0.4/valid/recommendation-pump-p201-inspection.json](../conformance/fixtures/v0.4/valid/recommendation-pump-p201-inspection.json)
7. Decision: [conformance/fixtures/v0.4/valid/decision-pump-p201-approve-inspection.json](../conformance/fixtures/v0.4/valid/decision-pump-p201-approve-inspection.json)
8. Action: [conformance/fixtures/v0.4/valid/action-pump-p201-inspection-completed.json](../conformance/fixtures/v0.4/valid/action-pump-p201-inspection-completed.json)
9. Outcome: [conformance/fixtures/v0.4/valid/outcome-pump-p201-vibration-reduced.json](../conformance/fixtures/v0.4/valid/outcome-pump-p201-vibration-reduced.json)

Supporting outcome evidence:

- Post-action observation: [conformance/fixtures/v0.4/valid/observation-pump-p201-vibration-post-inspection.json](../conformance/fixtures/v0.4/valid/observation-pump-p201-vibration-post-inspection.json)

## Contradictory source assertions

- OEM advisory: [conformance/fixtures/v0.4/valid/source-assertion-pump-p201-oem-vibration-advisory.json](../conformance/fixtures/v0.4/valid/source-assertion-pump-p201-oem-vibration-advisory.json)
- Operator normal-state claim: [conformance/fixtures/v0.4/valid/source-assertion-pump-p201-operator-normal-claim.json](../conformance/fixtures/v0.4/valid/source-assertion-pump-p201-operator-normal-claim.json)

These fixtures intentionally preserve disagreement without forcing premature reconciliation.