# First build prompt

Copy the block below into Claude Code or Codex, opened inside the repository.

---

Read AGENTS.md, docs/booking-rules.md, docs/data-model.md and docs/decisions/ADR-001-tech-stack.md.
Do not write application code yet.

Step 1 - Plan the scaffold. Propose:
- the project structure (modules, shared, config, tests, database),
- the local database setup,
- the ORM choice (Drizzle vs Prisma) with a short comparison for our case, including install/run feasibility without foreign services and support for raw SQL migrations,
- the single `verify` command (type check, lint, tests, build, architecture boundary check) and the tool for the boundary check,
- the fake payment and SMS adapters for local development.
List anything unclear and ask questions. Wait for my approval.

Step 2 - After approval, build the scaffold only: repo setup, database, migrations, seed data, `.env.example`, `verify`, Persian/RTL base layout with self-hosted font. Fill the Commands section in AGENTS.md. Run `verify` and report real results.

Step 3 - First thin end-to-end slice (no payment yet): venue and unit, schedule template, slot generation, manual booking by the manager, athlete booking, overlap constraint in the database, concurrent-booking test, manager view of bookings. Plan first, wait for approval, then implement in small steps.

Step 4 onward (one slice at a time, each with a plan and approval):
1. Payment with the fake adapter, 10-minute hold, idempotency, late-payment and refund rules.
2. Accounts and login (SMS code, then password), roles and permissions.
3. Office dashboard on the analytics layer.
4. Reviews, then complaints.
5. Confirmation SMS adapter.

Always report: summary, files changed, checks actually run with results, open issues.


Respect the phase boundaries in booking-rules.md. Phase 1 includes the city map and venue map display, simple filters (sport, date, price), and confirmation SMS. Phase 2 includes the athlete booking list/statuses, booking details, payment/refund status, PDF receipt, favorites, profile editing and password change. Preserve undecided policies as open questions; do not invent answers.

