# Architecture — Forge 2 Qualifier

## Agent roles

| Agent | Role | Description |
|---|---|---|
| **Hermes** (brain) | Orchestrator | Receives goals from the human in `#sprint-main`. Decomposes them into tasks, maintains persistent memory across sessions, runs skills, and posts status updates autonomously via cron. |
| **OpenClaw** (hands) | Coder | Listens in `#agent-coder`. Receives concrete coding tasks from Hermes, writes and runs code, and reports back with What I Did / What's Left / What Needs Your Call. |

## Slack channel scheme

| Channel | Purpose |
|---|---|
| `#sprint-main` | Human ↔ Hermes. Goals, plans, approvals. |
| `#agent-coder` | Hermes → OpenClaw task assignments. OpenClaw reports back here. |
| `#agent-log` | Autonomous cron runs, raw logs, Hermes memory snapshots. |

## Model routing

```
Hermes (planning)
  → primary:  Groq  openai/gpt-oss-120b
  → fallback: Gemini gemini-2.5-flash

OpenClaw (coding)
  → primary:  Ollama qwen2.5-coder  (local, unlimited)
  → fallback: Groq   llama-3.3-70b-versatile
```

**Routing rationale:**
- `gpt-oss-120b` has strong multi-step reasoning — ideal for Hermes' planning and decomposition.
- `qwen2.5-coder` is a code-specialised model. Running it locally via Ollama avoids rate limits during long coding sessions.
- Ollama as the primary coding model means no TPM walls mid-sprint — critical for a timed build.

## Repo structure

```
/
├── backend/          Laravel 13 REST API (SQLite)
│   ├── app/Models/
│   ├── app/Http/Controllers/
│   ├── database/migrations/
│   └── routes/api.php
├── frontend/         React 18 + Vite
│   └── src/
│       ├── components/
│       └── api.js
├── skills/
│   └── status-report/SKILL.md
├── slack-export/     Screenshots / evidence
├── agent-log.md      Full agent chat log
├── README.md
└── ARCHITECTURE.md
```

## Human-in-the-loop flow

```
Human (#sprint-main)
  └─→ Hermes: "Plan X"
        └─→ Hermes posts plan (#sprint-main)
              └─→ Human: "approved"
                    └─→ Hermes → OpenClaw: task in (#agent-coder)
                          └─→ OpenClaw codes, runs, posts result
                                └─→ What I Did / What's Left / What Needs Your Call
                                      └─→ Human reviews → next cycle
```
