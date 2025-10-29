# Savings Management System — Backend API

Node.js (Express + MongoDB) API for the Credit Jambo Savings app. Includes JWT auth, device verification, savings operations, admin tools, validation, security hardening, and Swagger docs.

## Tech Stack

- Express, Mongoose
- JWT (access/refresh), bcrypt
- Joi validation
- Security: Helmet, express-rate-limit, express-mongo-sanitize, CORS
- Swagger: swagger-jsdoc + swagger-ui-express

## Getting Started

1. Prerequisites

- Node.js 18+
- MongoDB (Atlas or local)

2. Install

```bash
cd backend
npm install
```

3. Environment
   Create a `.env` file in `backend/`:

```bash
PORT=6000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
JWT_SECRET=your_access_token_secret
REFRESH_SECRET=your_refresh_token_secret
ADMIN_EMAIL=admin@example.com
```

4. Run

```bash
# Development
npm run dev

# Production
npm run build && npm start
```

Server boots at `http://localhost:<PORT>` and seeds a default admin (from `seed-admin`).

## API Docs (Swagger)

- UI: `GET /api-docs`
- Uses OpenAPI 3.0 with bearer auth and reusable schemas.

## Authentication

- Scheme: `Authorization: Bearer <accessToken>`
- Users get both access and refresh tokens on login.
- Admin tokens include `isAdmin: true` in JWT payload.

## Core Endpoints

Base path: `/api/v1`

- Auth

  - `POST /auth/register` — register user (fullName, email, password, deviceId, pushToken?)
  - `POST /auth/login` — user login, requires device to be verified
  - `POST /auth/refresh` — exchange refresh token for a new access token
  - `POST /auth/push-token` — update push notification token (auth required)

- Savings (auth required)

  - `GET /savings/balance` — current balance
  - `POST /savings/deposit` — deposit amount
  - `POST /savings/withdraw` — withdraw amount
  - `GET /savings/history` — transaction history with pagination

- Admin (auth required with admin token)
  - `POST /admin/login` — admin login
  - `POST /admin/logout` — stateless logout (client discards token)
  - `GET /admin/stats` — dashboard metrics
  - `GET /admin/users` — list users (search, pagination)
  - `GET /admin/users/:userId` — get user by id
  - `POST /admin/users/:userId/verify-device` — mark device verified
  - `GET /admin/transactions` — list transactions (optional `userId` filter)

Explore full request/response schemas in Swagger at `/api-docs`.

## Security & Validation

- Helmet for common HTTP hardening
- Rate limiting (Redis store compatible) to throttle abusive requests
- Input validation with Joi per-route
- Mongo sanitize to prevent NoSQL injection
- CORS configured for local and admin panel origins

## Project Structure

```
backend/
  app.js                   # App bootstrap & route mounting
  src/
    config/
      db.config.js         # Mongo connection
      swagger.config.js    # Swagger setup
    controllers/           # Route controllers
    dtos/                  # Response shaping (DTOs)
    middlewares/           # Auth, validation, etc.
    models/                # Mongoose models
    routes/                # Route definitions
    utils/                 # JWT, push notifications, seeding
```

## Scripts

```json
{
  "dev": "nodemon app.js",
  "start": "node app.js"
}
```

## Notes

- Device must be verified by an admin before a user can log in.
- Logout is stateless; clients should delete stored tokens after `POST /admin/logout`.
- Keep secrets out of source control; use `.env`.
