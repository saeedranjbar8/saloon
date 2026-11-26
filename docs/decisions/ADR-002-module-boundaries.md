# ADR-002: Module boundary enforcement

Status: Accepted

## Decision
Each domain module in `src/modules/<name>` owns its implementation and tables. Other modules may depend only on that module's `index.ts` public entry point; relative imports into another module's implementation are forbidden. `scripts/check-boundaries.mjs` enforces this locally and through `npm run verify`.

## Consequences
The check is intentionally small and dependency-free. It currently detects relative TypeScript imports crossing module directories; aliases and dynamic imports must be added if introduced.
