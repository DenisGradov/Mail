todo:

Офферту
2fa

### Ниже дока, сделнная чатгпт. Это временная заглушка, просто инфа по тому как задеплоить и тд. Позже сам напишу адекватную
# 📧 Mail – Full‑Stack Mail Service

> **TL;DR**  
> Clone → `cp env.backend.example .env.backend` → `docker‑compose up -d --build` → open <http://localhost:5042>.  
> Pour yourself a coffee ☕, you’ve just spun up the whole stack.

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Local Development](#local-development)
    1. [Using Docker Compose (1‑liner)](#using-docker-compose-1-liner)
    2. [Running Without Docker](#running-without-docker)
4. [Deployment “А до Я” via GitHub Actions](#deployment-а-до-я-via-github-actions)
    1. [Server Prerequisites](#server-prerequisites)
    2. [Preparing the Repository](#preparing-the-repository)
    3. [Setting GitHub Secrets](#setting-github-secrets)
    4. [First‑time Setup on the Server](#first-time-setup-on-the-server)
    5. [Zero‑downtime Release Flow](#zero-downtime-release-flow)
5. [Project Structure](#project-structure)
6. [Environment Variables](#environment-variables)
7. [Common Make‑Life‑Easy Commands](#common-make-life-easy-commands)
8. [FAQ](#faq)

---

## Project Overview

**Mail** is a minimalist full‑stack application that demonstrates:

* RESTful authentication (JWT, cookies) on **Express 5**.
* Lightweight persistence on **SQLite 3** (file under `Backend/DataBase`).
* Modern **React 18** SPA built with **Vite** & **Tailwind CSS**.
* All glued together by **Docker** and served through **Nginx**.
* One‑click CI/CD courtesy of **GitHub Actions** + SSH.

Perfect for self‑hosting on a humble VPS or as a learning playground.

---

## Tech Stack

| Layer      | Technology                         |
|------------|------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS, Zustand |
| Backend    | Node 20, Express 5, SQLite 3       |
| Dev Tools  | Docker, docker‑compose, GitHub Actions |
| Proxy      | Nginx 1.27 (multi‑stage image)     |

---

## Local Development

### Using Docker Compose (1‑liner)

```bash
# 1. clone and enter the repo
git clone https://github.com/yourname/mail.git
cd mail

# 2. create env file & tweak values
cp env.backend.example .env.backend
nano .env.backend           # or vim/code, set secrets

# 3. fire it up
docker-compose up -d --build
```

Open your browser:

* **Frontend:** <http://localhost:5042>
* **Backend API:** <http://localhost:5050/api>

> **Heads‑up:** Database is a local file (`Backend/DataBase/mail.db`).  
> Stop & start containers as much as you like, the volume keeps the file.

### Running Without Docker

1. **Backend**

   ```bash
   cd Backend
   npm i
   cp ../env.backend.example .env        # or link manually
   npm run dev                           # nodemon hot‑reloads on save
   ```

   The server listens on `http://localhost:5050`.

2. **Frontend**

   ```bash
   cd ../Frontend
   npm i
   echo "VITE_BACKEND_URL=http://localhost:5050/api" > .env
   npm run dev
   ```

   Vite starts on `http://localhost:5173` and proxies requests to the backend.

> Tip: run both commands in two terminals or with [concurrently](https://www.npmjs.com/package/concurrently).

---

## Deployment “А до Я” via GitHub Actions

### Server Prerequisites

* Ubuntu 22.04 (or similar) with **Docker & docker‑compose** installed.
* SSH access for the deploy action (`sudo apt install docker docker-compose -y`).
* DNS A‑record pointing to your domain (e.g. `mail.example.com`).

### Preparing the Repository

The workflow file lives at `.github/workflows/deploy.yml` and already:

* Builds the app on every push to **`main`** or on manual dispatch.
* Rsyncs the repo to `/opt/mail` on the server.
* Runs `docker-compose up -d --build` remotely.
* Prunes dangling images to keep the disk tidy.

Feel free to tweak image tags, target path, or branch name.

### Setting GitHub Secrets

Go to **Settings → Secrets & Variables → Actions** and add:

| Secret          | Description                              |
|-----------------|------------------------------------------|
| `SSH_HOST`      | Public IP / hostname of the VPS          |
| `SSH_USER`      | Linux user with docker rights (usually `root`) |
| `SSH_PORT`      | SSH port (defaults to `22`)              |
| `SSH_KEY`       | **Private** key in PEM format            |

> **Never** commit `.env.backend` – keep sensitive data on the server only.

### First‑time Setup on the Server

```bash
ssh root@your‑server
apt update && apt install -y docker.io docker-compose
mkdir -p /opt/mail && chown -R $USER /opt/mail
# paste your .env.backend there
nano /opt/mail/.env.backend
```

Optionally tweak `nginx/nginx.conf` with your domain / SSL certs (e.g. Let’s Encrypt).

### Zero‑downtime Release Flow

1. Push to `main`.
2. GitHub Actions builds & ships new source.
3. Remote `docker-compose up -d --build` re‑creates containers.
4. Nginx keeps serving old instance until the new one is healthy – traffic blissfully unaware.

---

## Project Structure

```
.
├── Backend/                 # Express API + SQLite
│   ├── DataBase/            # db.js + migrations
│   ├── routes/              # authRoutes.js, mailRoutes.js
│   ├── Utils/               # hashing, helpers
│   └── server.js
├── Frontend/                # React SPA
│   ├── src/
│   ├── tailwind.config.js
│   └── vite.config.js
├── nginx/                   # Dockerfile + nginx.conf
├── docker-compose.yml       # glue everything together
└── .github/workflows/       # CI/CD pipeline
```

---

## Environment Variables

| Variable          | Location                    | Example                                  |
|-------------------|-----------------------------|------------------------------------------|
| `BACKEND_PORT`    | `.env.backend` (server)     | `5050`                                   |
| `ALLOWED_ORIGINS` | `.env.backend`             | `https://mail.example.com`               |
| `JWT_SECRET`      | `.env.backend`             | `please‑change‑me‑super‑secret`          |
| `SALT_PEPPER`     | `.env.backend`             | `twelve‑random‑chars`                    |
| `VITE_BACKEND_URL`| `Frontend/.env` (build‑time)| `/api` or `http://localhost:5050/api`    |

> **Pro tip:** keep `env.backend.example` up to date for newcomers.

---

## Common Make‑Life‑Easy Commands

| Task                         | Command                                   |
|------------------------------|-------------------------------------------|
| Start dev stack (docker)     | `docker-compose up -d --build`           |
| View logs                    | `docker-compose logs -f backend`         |
| Stop & remove containers     | `docker-compose down`                    |
| Enter backend container      | `docker exec -it mail-backend-1 sh`      |
| Inspect SQLite DB            | `sqlite3 Backend/DataBase/mail.db`       |

---

## FAQ

<details>
<summary>**The site loads but API requests fail with CORS**</summary>

Make sure your `ALLOWED_ORIGINS` includes the exact origin (scheme + domain + port).  
Remember that `http://localhost:5173` (Vite dev) and `http://localhost:5042` (Nginx) are two different origins.
</details>

<details>
<summary>**Database file disappeared after rebuild!**</summary>

If you run the stack *without* Docker the DB lives in your repo folder.  
Inside Docker it’s mounted as a volume (`Backend/DataBase`) – ensure `docker-compose.yml` kept the volume or bind‑mount intact.
</details>

---

Made with ❤️, caffeine, and a sprinkle of **future‑proof optimism**.

