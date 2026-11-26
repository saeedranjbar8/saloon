# ADR-001: Tech stack and architecture

Status: Accepted

## Context
Small team, vibe coding with AI agents, long-term growth (more cities, more services), hosting inside Iran, customer is a public-sector office.

## Decision
- TypeScript, Next.js, React, PostgreSQL.
- Modular Monolith. Business logic in `src/modules/*`, independent of Next.js. Next.js is a thin shell.
- Local development first; move to an Iranian host later (VPS with full access, Docker + nginx; Next.js standalone output).
- Payment and SMS behind interfaces, with fake adapters for local development.
- All checks must run locally; CI is an addition, not a requirement.

## Consequences
- Easy to extract a backend later if needed.
- Architecture boundaries must be enforced by an automated check.
- Foreign services (fonts, CDN, cloud monitoring, analytics) are not used without approval.

## Not decided yet
ORM (candidates: Drizzle, Prisma; booking constraints are written as raw SQL migrations either way), payment gateway, future AI model.
