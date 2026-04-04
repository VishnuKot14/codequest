# ⚔ CodeQuest

A gamified coding education platform — learn programming through an RPG adventure.

## Project Structure

```
codequest/
├── client/          # React + Vite + Tailwind frontend
│   └── src/
│       ├── pages/   # One file per route/screen
│       ├── components/  # Reusable UI pieces
│       └── lib/     # Store (Zustand) + API client (Axios)
└── server/          # Node.js + Express + Prisma backend
    ├── prisma/      # Database schema
    └── src/
        ├── routes/  # One file per feature area
        └── middleware/  # Auth (JWT verification)
```

## Prerequisites

- Node.js 18+
- PostgreSQL (or use a free cloud DB like Supabase/Neon)
- Python 3 (for running Python code submissions)

## Getting Started

### 1. Set up the database

```bash
cd server
cp .env.example .env
# Edit .env with your PostgreSQL connection string

npx prisma migrate dev --name init
npm run db:seed
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
# Runs on http://localhost:5000
```

### 3. Start the frontend

```bash
cd client
npm install
npm run dev
# Runs on http://localhost:3000
```

### 4. Open http://localhost:3000

## How It Works

| Layer | Tech | Purpose |
|-------|------|---------|
| Frontend | React + Vite | UI, routing, state |
| Styling | Tailwind CSS | Utility-first CSS |
| State | Zustand | Global auth + game state |
| HTTP | Axios | API calls to backend |
| Editor | Monaco | In-browser code editor |
| Backend | Express.js | REST API |
| Database | PostgreSQL + Prisma | Persistent data |
| Auth | JWT + bcrypt | Secure login |

## Features
- [x] Landing page
- [x] Register with character creation (avatar + class)
- [x] Adventure world map with 6 language regions
- [x] In-browser code editor (Monaco)
- [x] Lesson system with tests + XP rewards
- [x] XP bar + leveling system
- [x] Character profile + equipment slots
- [x] Global leaderboard
- [x] PvP duels (real-time WebSockets)
- [x] Boss battles (multi-phase challenges with lives)
- [x] Item shop with equip system + atomic transactions
- [x] Guild system (create, join, leave, leaderboard)
- [x] Extended language support: Python, JavaScript, TypeScript, Rust, Go, SQL
