# Credit Jambo — Savings App (Monorepo)

This repo contains the backend API (Node/Express + MongoDB) and the mobile app (React Native + Expo) for a simple savings management system with device verification and JWT authentication.

## Structure

```
./
  backend/   # Express API + MongoDB
  mobile/    # React Native (Expo) client
```

## Quick Start

- Backend

  - Env: create `backend/.env` (see `.env.example`)
  - Install & run:
    ```bash
    cd backend && npm install && npm run dev
    ```
  - Docs: visit `http://localhost:<PORT>/api-docs`

- Mobile
  - Install & run:
    ```bash
    cd mobile && npm install && npm run dev
    ```
  - Open in Expo Go (QR) or run iOS/Android simulators via the Expo dev server.

## Key Features

- JWT auth (access + refresh) with device verification
- Savings: deposit, withdraw, balance, history
- Admin: login, verify devices, users/transactions lists, stats
- Input validation (Joi), security (Helmet, rate limiting, sanitize), Swagger docs

## URLs

- Backend base: `http://localhost:<PORT>/api/v1`
- Swagger UI: `http://localhost:<PORT>/api-docs`

## Notes

- Ensure MongoDB is reachable and env vars are set before starting the backend.
- Mobile app’s API base URL can be configured in `mobile/lib/api.ts`.
