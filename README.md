# APZ Markdown Dashboard

Production-oriented MVP for multilingual Markdown documentation, human approval,
diff/version tracking, notifications, and optional APZ Chain anchoring.

## Stack
- API: Node.js + Express
- DB: PostgreSQL
- Web: Next.js
- Auth: JWT + bcrypt
- Notifications: Telegram + Discord
- Deployment: Docker Compose / PM2 / GitHub Actions

## Quick start
1. Copy `apps/api/.env.example` to `apps/api/.env`.
2. Set `JWT_SECRET`, `DATABASE_URL`, and optional notification credentials.
3. Run:
   `docker compose up --build`
4. API health: `http://localhost:3001/health`
5. Web: `http://localhost:3000`

Default development admin:
- email: `admin@apz.local`
- password: `change-me-now`

Change these credentials before production.
