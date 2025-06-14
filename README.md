# Bibliotheca v2 [bibliothecav2.vercel.app](https://bibliothecav2.vercel.app)

A modern, full-stack eBook store and reader platform built with Next.js, Supabase, and XState.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack &amp; Packages](#tech-stack--packages)
- [Database Schema](#database-schema)
- [State Machines](#state-machines)
- [APIs](#apis)
- [Build &amp; Run](#build--run)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## Overview

Bibliotheca is an online bookstore and eBook reader. Users can browse, purchase, and read eBooks in their browser. Admins can manage books and users. The platform supports secure authentication, payments, and a personalized eBook library.

## Features

- User authentication (Supabase Auth)
- Browse and search books by category
- Add to cart and checkout with payment simulation
- Purchase history and payment history
- Personal eBook library (only purchased books)
- In-browser EPUB reader (epubjs)
- Admin dashboard for book/user management
- Responsive, theme-aware UI (light/dark)
- Contact form with email (nodemailer)
- State machines for checkout flow (XState)
- Analytics (Vercel Analytics)

## Tech Stack & Packages

- **Frontend:** Next.js 15, React 19, Tailwind CSS 4, next-themes
- **State Management:** Context API (Auth, Cart), XState (checkout)
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **eBook Reader:** epubjs
- **Email:** nodemailer
- **Carousel:** embla-carousel-react
- **Icons:** react-icons, lucide-react
- **Other:** class-variance-authority, clsx, dotenv, tailwindcss-animate

### Key Packages (from `package.json`)

- `@supabase/supabase-js`, `@supabase/ssr`
- `epubjs`, `embla-carousel-react`
- `@xstate/react`, `xstate`
- `next`, `react`, `tailwindcss`, `next-themes`
- `nodemailer`, `pg`, `bcrypt`

## Database Schema

### Users & Auth

- `profiles`: user profile info (id, name, email)
- `user_sessions`: session tokens, expiry, user_id
- `admin_users`: admin login, hashed password, policies

### Books & Purchases

- `books`: id, title, author, image, file_url (nullable), created_at
- `purchases`: id, user_id, book_id, purchased_at (unique per user/book)
- `payments`: id, user_id, amount, status, payment_method, created_at

### Example Migration (see `supabase/migrations/`):

```sql
CREATE TABLE IF NOT EXISTS books (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    title text NOT NULL,
    author text NOT NULL,
    image text,
    file_url text,
    created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS purchases (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
    book_id uuid REFERENCES books(id) ON DELETE CASCADE,
    purchased_at timestamptz DEFAULT now(),
    UNIQUE (user_id, book_id)
);
```

## State Machines

- **Checkout:** XState machine in `app/stateMachines/checkoutMachine.js` manages cart, checkout, payment, confirmation, and error states.
- **Services:** Payment simulation in `app/stateMachines/services.js`.

## APIs

- **Contact/Review:** `app/api/send-review/route.js` (POST) — sends email via nodemailer.
- **Supabase:** Used for all DB operations (auth, books, purchases, payments, etc.)

## Build & Run

### Prerequisites

- Node.js 18+
- Supabase project (see migrations in `supabase/migrations/`)
- Environment variables:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - (for email) `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`

### Local Development

```powershell
npm install
npm run dev
```

### Build for Production

```powershell
npm run build
npm start
```

## Deployment

- Deploy on [Vercel](https://vercel.com/) for best SSR/ISR support.
- Set all required environment variables in Vercel dashboard.

## Project Structure

```
app/
  shop/           # Book browsing & add to cart
  cart/           # Cart UI
  checkout/       # Checkout & payment
  user/           # User profile, history
  reader/         # eBook library & reader
  admin/          # Admin dashboard
  api/            # API routes (contact, etc)
  stateMachines/  # XState machines
components/       # UI components, EBookReader, etc
context/          # AuthContext, CartContext
lib/              # Supabase client, utils
public/           # Images, covers, static assets
supabase/         # DB migrations
```

## How It Works

- **User Flow:**
  1. User signs up/logs in (Supabase Auth)
  2. Browses books, adds to cart
  3. Proceeds to checkout (XState manages flow)
  4. On payment, purchase and payment records are created in DB
  5. Purchased books appear in user's eBook library (reader page)
  6. User can read EPUBs in-browser (epubjs)
- **Admin Flow:**
  1. Admin logs in via `/admin/login`
  2. Can add/edit books, view users/orders
- **API:**
  - Contact form sends email via `/api/send-review`
- **State:**
  - Auth and cart state via React Context
  - Checkout flow via XState

---

For more, see code comments and each folder's README (if present).
