# Mobile App — Credit Jambo Savings

React Native app (Expo) for users to register, login (after device verification), view balance, deposit/withdraw, and see history.

## Prerequisites

- Node.js 18+
- Expo CLI (optional)
- Backend API running (see project root or `backend/`)

## Setup

```bash
cd mobile
npm install
npm run dev
```

This starts the Expo Dev Server. Use Expo Go (QR), iOS simulator (i), or Android emulator (a).

## Configure API URL

Update the backend base URL in:

- `mobile/lib/api.ts` → `API_BASE_URL`

Default points to a hosted URL. Set it to your local API for development, e.g.:

```ts
const API_BASE_URL = 'http://localhost:6000/api/v1';
```

On real devices, use your machine IP instead of `localhost`.

## Features

- Email/password auth with access/refresh tokens
- Device verification gate before login
- Deposit, withdraw, balance, and transaction history
- Auto-refresh access token when expired

## Scripts

```bash
npm run dev     # Start Expo Dev Server
```

## Tips

- If refresh fails, the app clears tokens and returns to login
- Ensure your backend CORS allows the mobile origin
- Keep your access and refresh tokens secure (AsyncStorage)
