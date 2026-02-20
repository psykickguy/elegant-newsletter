# AI-Powered Frontend Newsletter Engine (Milestone 1)

## Overview

Automated research and AI-driven newsletter draft generation system.

### Features

- Multi-source ingestion (Reddit, GitHub, Dev.to)
- Structured PostgreSQL storage
- Local LLM generation via Ollama
- HTML newsletter draft creation
- Slack notification delivery
- Dockerized 1-click infrastructure

---

## Architecture

Workflow 1:
Sources → Clean → Database → Slack Notification

Workflow 2:
Database → Prompt Builder → Ollama → HTML Draft → Slack

---

## Setup

```bash
git clone <repo>
cd elegant-newsletter-m1
docker-compose up -d
```

## Access:

n8n: `http://localhost:5678`
Ollama: `http://localhost:11434`
Postgres: `localhost:5432`
