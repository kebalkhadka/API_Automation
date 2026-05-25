# Playwright High-Scale API Differential Testing Framework

An industrial production-grade framework engineered to run multi-environment payload delta analysis across large end-points concurrently using Playwright, Node.js 20+, and Deep-Diff structural sorting algorithms.

## Design Architecture Blueprint
- **Dynamic Worker Parallelization**: Dynamically transforms `apis.json` definition array layouts into parallelized execution steps leveraging independent worker processes.
- **Sanitization Pipeline**: Normalizes structurally safe discrepancies by purging timestamps, dynamic system IDs, and explicitly sorting nested JSON arrays to ensure order-agnostic matches.
- **Multi-tiered Reporting System**: Compiles metrics concurrently into Playwright HTML viewports, raw target CSV arrays, JSON nodes, and detailed Allure tracking structures.

## Installation & Environment Setups

Ensure Node.js v20+ is running in your current terminal workspace.

```bash
# Clone and open directory
npm install
npx playwright install
```

Running the test 
```bash 

# Execute structural comparison regressions across all 100+ routes in parallel
npm run test

# Run a single target endpoint set via metadata tagging 
npm run test:group -- "@smoke"

# Force sequential execution on environment tracking layers
npm run test:serial