# Mini Test App

A MERN stack online test application built as an internship assessment.

## Features

- Student signup and login (JWT auth)
- 10 random multiple-choice questions per test
- 10-minute countdown timer with auto-submit
- Result page with score, per-question breakdown, and correct answers
- History page listing all past attempts
- Admin page to add/delete questions (admin users only)

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, DaisyUI (corporate theme), React Router, Axios
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT + bcrypt

---

## Running Locally

### Prerequisites

- Node.js 18+
- A MongoDB database (MongoDB Atlas free tier works)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd infinityClassAssessment
```

### 2. Configure the server

```bash
cd server
cp .env.example .env   # or create .env manually
```

Edit `server/.env`:

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/minitest
JWT_SECRET=your_long_random_secret
```

### 3. Install dependencies

```bash
# Server
cd server
npm install

# Client
cd ../client
npm install
```

### 4. Seed the database

```bash
cd server
npm run seed
```

This inserts 15 sample questions into the `questions` collection.

### 5. Start the development servers

In two separate terminals:

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Creating an Admin Account

Register normally through the app, then run this in MongoDB shell or Compass:

```js
db.users.updateOne({ email: "your@email.com" }, { $set: { isAdmin: true } })
```

Admin users see an **Admin** link in the navbar.

---

## Project Structure

```
infinityClassAssessment/
├── client/                  React frontend
│   └── src/
│       ├── api/             Axios instance
│       ├── components/      Navbar, Timer, QuestionCard, ProtectedRoute
│       ├── context/         AuthContext
│       └── pages/           Login, Signup, Home, Test, Result, History, Admin
└── server/                  Express backend
    ├── middleware/          JWT auth middleware
    ├── models/              User, Question, Attempt schemas
    ├── routes/              auth, questions, attempts, admin
    ├── seed.js              DB seeder
    └── index.js             Entry point
```

---

## Deployment

### Backend (Render)

1. Create a new **Web Service** on Render
2. Set root directory to `server`
3. Build command: `npm install`
4. Start command: `npm start`
5. Add environment variables: `MONGO_URI`, `JWT_SECRET`, `PORT`

### Frontend (Vercel / Netlify)

1. Set root directory to `client`
2. Build command: `npm run build`
3. Output directory: `dist`
4. Add environment variable: `VITE_API_URL` if not using a proxy (update `client/src/api/axios.js` baseURL accordingly)
