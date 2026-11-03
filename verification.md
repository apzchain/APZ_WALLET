# APZ Document Verification

Dashboard و APZ Chain از یک شناسه‌ی رمزنگاری‌شده برای اثبات نسخه استفاده می‌کنند.

## Flow

`Markdown content → SHA-256 → DocumentAnchor → transaction → verification`

API:

- `POST /api/anchors/:id` برای Anchor کردن سند
- `GET /api/anchors/verify/:id` برای بررسی Anchor

در Production، RPC، contract address و private key باید از secret manager
خوانده شوند. کلید خصوصی نباید commit یا در Docker image قرار گیرد.
