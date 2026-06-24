# Forge 2 · Qualifier — Kanban Board

A Trello-style Kanban board built by a two-agent system (OpenClaw + Hermes) as part of the Forge 2 Edition 1 qualifier.

## What the app does

- Create boards with multiple lists (To-Do / Doing / Done)
- Add cards with title, description, due date, and overdue flag
- Drag-and-drop cards between lists
- Colour-coded tags / labels on cards
- Assign board members to cards
- Comments / activity feed on each card

## Models used

| Agent | Model | Why |
|---|---|---|
| Hermes (brain/planning) | `openai/gpt-oss-120b` via Groq | Strong reasoning for decomposing tasks and writing plans |
| OpenClaw (hands/coding) | `qwen2.5-coder` via Ollama (local) | Optimised for code generation, unlimited local usage, no rate limits |

Fallback: Groq → Gemini `gemini-2.5-flash` → OpenRouter `:free` variant.

## Run locally

### Prerequisites
- PHP 8.2+, Composer
- Node 22+ (Node 20 works for frontend only)
- Ollama with `qwen2.5-coder` pulled: `ollama pull qwen2.5-coder`

### Backend (Laravel API)

```bash
cd backend
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve        # runs on http://localhost:8000
```

### Frontend (React + Vite)

```bash
cd frontend
cp .env.example .env     # set VITE_API_URL=http://localhost:8000/api
npm install
npm run dev              # runs on http://localhost:5173
```

## Live URL

> **Frontend:** https://forge2-qualifier-saksham.vercel.app
> **API:** https://forge2-kanban-api-ex95.onrender.com

## Agent setup

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the full agent/model/channel breakdown.
