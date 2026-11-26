# AGENTS.md

Rules for AI coding agents (Codex, Claude Code). Keep this file short. Details live in `docs/`.

## 1. Project

Sports facility booking and management platform. First target: Bafgh, Iran.

Roles:
- **Athlete:** books slots. Later: classes, events and other services.
- **Facility Manager:** manages own facility: schedule, prices, bookings. Access only to own facility.
- **Sports Administration:** highest authority. Sees all data, creates facilities and manager accounts, supervises prices, handles complaints and reviews, uses analytics (later an AI chatbot).

The platform will expand to other cities and services, but never build future features early.

Source of truth:
- Business rules: `docs/booking-rules.md`
- Data model: `docs/data-model.md`
- Decisions: `docs/decisions/`

## 2. Stack (decided; do not reopen without a clear technical reason)

TypeScript, Next.js, React, PostgreSQL.
Development is local first. Production hosting will be inside Iran.
ORM is not decided yet (will be an ADR). Add other tools only when a real need exists.

## 3. Architecture

- Modular Monolith. No microservices.
- Business logic lives in `src/modules/*` as plain TypeScript, independent of Next.js, UI, Server Actions and Route Handlers. Pages and routes are thin shells that call modules.
- Modules talk only through their public interface. Direct access to another module's internals or tables is forbidden.
- Boundaries are enforced by an automated check that runs locally and in CI.
- Every facility belongs to a city (multi-city from day one).
- Do not build a multi-layer structure in a module until it is justified.

## 4. Booking rules

- Overlap prevention must exist in the database (exclusion/unique constraints), not only in code.
- Booking and payment operations are transactional and idempotent.
- Status transitions follow `docs/booking-rules.md`. Money status is tracked separately from booking status.
- Store price snapshots on each booking.
- Never invent business rules. If something is undecided, ask the owner or write it as an open decision.

## 5. Data, analytics and AI

- Record important actions as structured events: booking, cancellation, slot blocking, price change, manual booking, status change (mark auto vs manual).
- Analytics and the future chatbot use a separate read-only aggregated layer, never the operational tables.
- The analytics layer must not contain personal identifiers.
- The Sports Administration may see personal data in the admin UI; every such access is logged (`access_log`).
- No event sourcing. Structured events are enough.

## 5. Security

- Authorization is enforced on the server. Never rely on UI visibility.
- Athletes: first login by SMS code, then set a password; later logins use password. Managers and Sports Administration log in with password (no first-login OTP). Forgot-password via SMS.
- Hash passwords with a strong algorithm (argon2 or bcrypt). Limit failed attempts. SMS codes are short-lived and rate-limited. Enforce a minimum password length.
- Keep a place in the auth design for a second factor (office and manager accounts). Not required now.
- Facility Managers see only the data they need about their own facility.
- Never commit secrets or real user data.

## 6. Iran-specific rules

- Persian UI, RTL from the start, Jalali date display. Store timestamps with time zone; local zone is Asia/Tehran.
- Money: integer **rial** in the database; show **toman** in the UI.
- Holidays come from data, never hardcoded.
- Payment gateway and SMS provider sit behind interfaces. Provide fake local adapters for development.
- No external fonts, CDNs, scripts, analytics or cloud services without approval. Self-host fonts.
- Before adding a dependency, check it installs and runs without contacting foreign services (binary downloads, telemetry).

## 7. Language

- Code, identifiers, comments, commits and branch names: English.
- User-facing Persian text lives in translation files, not scattered in code.

## 8. Workflow

- Small, focused feature slices. Do not build several big features at once.
- For new features, database changes, architecture changes and business-rule changes: first present a short plan (files, data changes, risks) and wait for approval.
- Small low-risk fixes inside an approved request may be done directly.
- Important features need a written spec in `docs/features/` before code.
- Record important architecture decisions in `docs/decisions/` as short ADRs.
- No unrelated changes, no large rewrites, no new dependency without justification.
- Be economical: do not re-read or rewrite large files without need.
- Provide `.env.example` and seed data with sample data for local runs.

## 9. Git

- One branch and one pull request per feature. Keep `main` stable.
- Meaningful commit messages (`feat:`, `fix:`, `refactor:`, `test:`, `docs:`).
- The verification command must work locally and must not depend only on GitHub Actions.

## 10. Testing and Definition of Done

There must be one local command (`verify`, to be created in the scaffold step) that runs: type check, lint, tests, build, and the architecture boundary check.

Critical flows need tests: booking, concurrent booking, permissions, payment.

A change is done only when:
- it matches the approved scope,
- verify passes,
- security and permission impact was considered,
- docs are updated if rules or structure changed.

Never claim a check passed unless you ran it and saw the result. Report anything not run.

Final report: summary, files changed, checks actually run with results, open issues.

## 11. Commands

- Install: `npm install`
- Development: `npm run dev` (Next.js shell is added with the web scaffold).
- Test: `npm test`
- Verify: `npm run verify` (type check, lint, tests, boundaries, build).
- Seed: `npm run seed`
- Migrate: apply SQL files in `db/migrations` with the selected database tooling; ORM remains undecided.

## 12. Product phases\n\n- Phase 1 (MVP): core booking and payment, venue/slot discovery with simple filters (sport, date, price), city map and venue map display, manager manual booking, manager and office tools, reviews/ratings, simple complaints, confirmation SMS, and the approved basic office dashboard.\n- Phase 2: athlete booking list grouped by status; booking details; payment/refund status; transaction receipt with PDF; favorites; profile editing; password change; reminders via SMS or Eitaa/Bale.\n- Phase 3: disciplinary actions, chatbot/AI, and other future expansion. Do not move the city map into Phase 3.\n- Athlete cancellation remains deferred; slot reopening notifications remain deferred. Account deletion is out of MVP.\n\n## 13. Open decisions (do not assume)

- Payment gateway and payment flow details; legal ownership and partnership model.
- ORM and database access tooling.
- Cancellation by athletes (not in v1; only manager/office can cancel).
- Overlap between whole-venue booking and section booking.
- Athletes under 18.
- Second factor for office accounts.
- Future AI model and hosting.
- Deployment and infrastructure details.


## 11. Commands

- Install: 
pm install`n- Development: 
pm run dev (Next.js shell is added with the web scaffold).
- Test: 
pm test`n- Verify: 
pm run verify (type check, lint, tests, boundaries, build).
- Seed: 
pm run seed`n- Migrate: apply SQL files in db/migrations with the selected database tooling; ORM tooling remains undecided.

