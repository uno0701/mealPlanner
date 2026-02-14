# Weekly Meal Planner

A full-stack weekly meal planner web app built with Next.js, PostgreSQL, and Prisma.

## Features

- **Recipe Book** — Create, edit, and organize recipes with structured ingredients
- **Weekly Planner** — Drag-and-drop meal planning on a 7-day board
- **Grocery Lists** — Auto-generated from planned meals with smart ingredient aggregation
- **Collaboration** — Invite members to view plans and suggest meals
- **Shared Grocery Lists** — Collaborate on shopping with shared check-off lists

## Tech Stack

- Next.js (App Router)
- PostgreSQL + Prisma
- NextAuth.js v5 (Auth.js)
- Tailwind CSS
- Zod validation
- bcryptjs for password hashing

## Getting Started

```bash
npm install
npx prisma migrate dev
npm run dev
```
