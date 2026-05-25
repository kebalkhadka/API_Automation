# Playwright High-Scale API Differential Testing Framework

**Author:** Kebal Khadka

A production-grade API differential testing framework engineered to execute large-scale multi-environment payload comparison and structural delta analysis across hundreds of endpoints concurrently using Playwright, Node.js 20+, and Deep-Diff-based normalization strategies.

---

# Core Architecture

## Dynamic Worker Parallelization
Transforms `apis.json` endpoint definitions into independently distributed worker execution layers, enabling high-throughput parallel API validation across multiple environments.

## Structural Sanitization Pipeline
Normalizes non-deterministic response fields by removing:
- timestamps
- generated system identifiers
- session values
- dynamic metadata

Nested arrays are recursively sorted to support order-agnostic structural comparison.

## Differential Payload Analysis
Performs deep structural comparisons between source and target environments to identify:
- missing nodes
- type mismatches
- schema drift
- nested payload deviations
- response inconsistencies

## Multi-tiered Reporting System
Generates consolidated reporting artifacts across:
- Playwright HTML Reports
- CSV Differential Outputs
- Raw JSON Comparison Logs
- Allure Reporting Dashboards

---

# Tech Stack

- :contentReference[oaicite:0]{index=0}
- Node.js 20+
- TypeScript
- Deep-Diff
- Allure Reporting
- Concurrent Worker Execution

---

# Installation & Environment Setup

Ensure the following prerequisites are installed:

- Node.js v20+
- npm v9+
- TypeScript

---

## 1. Clone Repository

```bash
git clone <repository-url>
cd <project-folder>
```
## 2. Install Dependencies
```bash
npm install
```
## 3. Install Playwright Browsers
```bash
npx playwright install
```
### Running Tests
### Execute Full Parallel Differential Regression
```bash 
npm run test
```

### Execute Tagged Endpoint Groups
```bash
npm run test:group -- "@smoke"
```

### Execute Sequential Mode (Debugging)
```bash
npm run test:serial
```

## Output Reports
- Playwright HTML Report (execution trace + failures)
- CSV Differential Output (structured mismatches)
- JSON Logs (raw payload comparisons)
- Allure Dashboard (test analytics)



