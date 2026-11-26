# TikGuard Hub V14 (V13 client integration + V14 security review)

Arabic-first local prototype for editorial content planning, task assignments, and team administration. It **does not** log into TikTok or automate likes, follows, comments, or engagement actions.

## Features
- API-connected browser client (`public/index.html`) using Bearer session token.
- SQLite local database for users, content items, tasks, sessions, audit log.
- CLI-only first-admin creation; public signup disabled.
- Admin/editor create content and tasks; reviewer status-only content updates and task-status changes; viewer read-only.
- Login attempts throttling; 8-hour sessions; stored token hashes use HMAC-SHA256 with configured secret.
- Calendar dates validated as actual calendar dates, not regex-only.
- HTML text escaping in the client.

## Requirements
Node.js 18+ (LTS recommended), npm.

## Setup (local computer)
1. Extract this folder.
2. Copy `.env.example` to `.env` and set a fresh secret (at least 32 characters). Generate one with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
3. Install dependencies: `npm install`.
4. Create admin: `node server/create-admin.js` (prompts in terminal).
5. Run: `npm start`.
6. Open `http://localhost:3000`.
7. Health endpoint: `http://localhost:3000/api/health`.

## Checks
- `npm run check`: syntax-checks server and CLI, and the browser's embedded script.
- `npm test`: static smoke tests for authentication, role gates, date validation, endpoints, and safe scope.

## Important limitations
This is a local development prototype, not production-ready. Browser interaction tests and live API integration tests still require installing dependencies and running it in an actual browser. Do not expose it to the internet. Production requires HTTPS, CSP, additional security review, backups, and a threat model. The `.env` secret is required and is used to HMAC session-token hashes; do not reuse or publish it.
