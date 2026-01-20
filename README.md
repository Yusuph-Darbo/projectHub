# ProjectHub

**ProjectHub** is a full-stack project management system built with **Express**, **React**, and **PostgreSQL**. It features **JWT authentication**, **task and project CRUD operations**, and real-time updates across users and projects.

---

## Features

- **User Authentication**
  - Sign up, sign in with JWT
  - Secure token storage

- **Project Management**
  - Create, edit, view, and delete projects
  - Projects belong to authenticated users

- **Task Management**
  - Create tasks within projects
  - Update titles, descriptions, and status

- **Real-Time Updates**
  - UI updates instantly after create/edit/delete
  - Reflects changes in task boards

- **Kanban Board**
  - Tasks categorized by “To Do”, “In Progress”, and “Done”
  - Drag & drop (if implemented)

---

## Tech Stack

| Layer           | Technology                      |
| --------------- | ------------------------------- |
| Frontend        | React                           |
| Backend         | Express.js                      |
| Database        | PostgreSQL                      |
| Authentication  | JWT                             |
| Package manager | PNPM / NPM                      |
| Styling         | CSS Modules / Tailwind / Custom |

---

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js (v16+)
- PostgreSQL
- Your preferred package manager (`npm`, `pnpm`, or `yarn`)

---

### Backend Setup

```bash
cd backend
cp .env.example .env
# Set up your environment variables (DB connection, JWT_SECRET, etc.)
pnpm install
pnpm run dev
```

### Frontend Setup

```bash
cd frontend
pnpm install
pnpm run dev
```

## Deployment

You can deploy:

- **Frontend** to static hosts (Vercel, Render static)
- **Backend** to Node hosts (Render, Railway, Heroku)
- **Database** to managed Postgres providers

Make sure static assets are built and served correctly with appropriate MIME headers for JS modules.
