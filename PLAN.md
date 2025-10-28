# 🧭 PROJECT PLAN — Credit Jambo Savings App

*(For 5 working days starting Monday)*

---

### ⚙️ OVERVIEW

You’ll build **two apps**:

1. **Client Mobile App** – built with **React Native (Expo)**
    
    For customers to:
    
    - Register / Login
    - Wait for admin device verification
    - Deposit / Withdraw
    - View balance and transactions
    - Get push notifications (optional if time allows)
2. **Admin Web App** – built with **React + Vite + Tailwind**
    
    For admin to:
    
    - Login
    - View customers and transactions
    - Verify or block devices

Both apps share **one backend** built with **Node.js (Express + MongoDB Atlas)**.

---

## 🏗️ Backend Plan (Node.js + Express + MongoDB)

### 🔩 Core Features

- JWT Authentication
- SHA-512 password hashing
- Device verification system
- Deposit / Withdraw routes
- Transaction history
- Balance checks
- Security (Helmet, Rate limiting, Input validation)
- DTOs to hide sensitive fields

### 📁 Folder Structure

```
backend/
 ├── src/
 │   ├── controllers/
 │   ├── routes/
 │   ├── models/
 │   ├── services/
 │   ├── middlewares/
 │   ├── dtos/
 │   └── utils/
 ├── .env.example
 ├── package.json
 └── server.js

```

### 🧩 Example APIs

| Route | Method | Description |
| --- | --- | --- |
| `/api/auth/register` | POST | Register customer with deviceId |
| `/api/auth/login` | POST | Login (only if device verified) |
| `/api/admin/login` | POST | Admin login |
| `/api/admin/verify-device/:userId` | PATCH | Mark device as verified |
| `/api/savings/deposit` | POST | Deposit money |
| `/api/savings/withdraw` | POST | Withdraw money |
| `/api/savings/history` | GET | Get transaction history |
| `/api/savings/balance` | GET | View balance |

---

## 📱 Client App Plan (React Native + Expo)

### Main Screens

1. **Register / Login**
2. **Waiting Verification** (if device not yet approved)
3. **Dashboard** – Balance + Transaction list
4. **Deposit / Withdraw forms**
5. **Low Balance Alert**
6. *(Optional)* Push notifications for deposits, withdrawals

### Folder Structure

```
client/
 ├── src/
 │   ├── screens/
 │   ├── components/
 │   ├── services/ (Axios API calls)
 │   ├── context/ (Auth & user state)
 │   └── utils/
 ├── App.tsx
 └── package.json

```

---

## 💻 Admin App Plan (React + Vite)

### Main Pages

1. **Login Page**
2. **Dashboard**
    - List of customers + balances
    - Verify devices button
    - Transaction table
3. *(Optional)* Charts for statistics

---

## 🗓️ Daily Timeline (Realistic)

| Day | Tasks | Output |
| --- | --- | --- |
| **Monday** | Setup repos (backend, mobile, admin). Setup DB, base routes, JWT, SHA-512. | Working register/login API |
| **Tuesday** | Implement device verification logic, admin routes, and models. | Admin can verify device. |
| **Wednesday** | Add deposit/withdraw + balance + history APIs. Add validation + DTOs. | Core API complete. |
| **Thursday** | Build React Native screens (register, login, dashboard, deposit, withdraw). | Working mobile app (basic). |
| **Friday** | Build simple admin web app, connect APIs, add Helmet, rate limiting, and finalize README. | Submission-ready project. |

---

## 🧰 Tools & Libraries

### Backend

- express, mongoose, jsonwebtoken, helmet, express-rate-limit, joi (validation), crypto

### Mobile

- expo, axios, react-navigation, @react-native-async-storage/async-storage, react-native-device-info

### Admin

- react, vite, axios, react-router-dom, tailwindcss

---

## 🧾 Submission Checklist

✅ Working backend with core APIs

✅ Mobile app can register/login/deposit/withdraw

✅ Admin web app can verify devices

✅ README.md with setup instructions

✅ .env.example included

✅ Security (JWT, Helmet, validation)

✅ Clean commits and structure