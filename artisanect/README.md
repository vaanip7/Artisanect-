# Artisanect 🎨

> A handmade-goods marketplace connecting skilled artisans directly with buyers who value authentic craft — pottery, textiles, woodwork, jewellery, and more.
An AI-powered marketplace connecting local artisans and handicraft sellers with customers, built with React + Vite + Tailwind CSS on the frontend and Express on the backend.

The app has two roles, chosen at login (no real passwords yet — it's a demo auth flow):
- **Customer** — browse/search/filter products, view product details, manage a cart and wishlist, view profile.
- **Crafter** — a seller dashboard with live stats, upload/edit/delete products, view orders received (dummy data), and a showcase gallery.
---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Database Choice](#database-choice)
4. [Architecture](#architecture)
5. [Schema Diagram](#schema-diagram)
6. [Installation](#installation)
7. [Environment Setup](#environment-setup)
8. [Database Setup (Supabase)](#database-setup-supabase)
9. [Running Locally](#running-locally)
10. [API Endpoints](#api-endpoints)
11. [Folder Structure](#folder-structure)
12. [Demo Credentials](#demo-credentials)
13. [Future Improvements](#future-improvements)

---

## Project Overview

Artisanect is a full-stack web marketplace built as part of an AI-Assisted Full Stack Internship (Weeks 1–5). It allows:
- **Customers** to browse, search, wishlist, and cart handcrafted products.
- **Crafters (Artisans)** to list products, manage inventory, and view orders.

Week 5 migrated the application from in-memory data storage to a real cloud PostgreSQL database hosted on Supabase, with Prisma ORM for type-safe queries.

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | React 18, Vite, Tailwind CSS v3     |
| Routing    | React Router v6                     |
| Backend    | Node.js + Express 4                 |
| ORM        | Prisma 6.19.2                       |
| Database   | PostgreSQL 16 (Supabase cloud)      |
| Auth       | JWT (jsonwebtoken) + bcrypt         |
| State      | React Context API                   |

---

## Database Choice

**PostgreSQL via Supabase + Prisma ORM**

### Why PostgreSQL over MongoDB?

| Consideration         | PostgreSQL ✅                              | MongoDB ❌                                |
|-----------------------|--------------------------------------------|-------------------------------------------|
| Data shape            | Fixed, well-known schema                   | Variable / document-shaped                |
| Relationships         | User → Product, CartItem, WishlistItem     | Embedded arrays — harder to query         |
| ACID transactions     | Full support                               | Limited multi-doc support                 |
| Unique constraints    | `UNIQUE(userId, productId)` on cart rows   | Requires manual application logic         |
| Cascade deletes       | Native FK `ON DELETE CASCADE`              | Manual cleanup required                   |
| Type safety           | Prisma generates full TypeScript types     | Mongoose types are loosely typed          |

Every relationship in Artisanect is a well-known FK relationship (crafter → products, customer → cart/wishlist). This is a relational problem and PostgreSQL with Prisma solves it cleanly.

### Why Supabase?

- Free PostgreSQL cloud hosting (no credit card needed)
- Built-in connection pooling (PgBouncer) via `DATABASE_URL`
- Direct connection URL for Prisma migrations via `DIRECT_URL`
- Accessible dashboard to inspect data visually

---

## Architecture

```
┌──────────────────────────┐         ┌──────────────────────────┐
│  React Frontend          │         │  Express Backend          │
│  (Vite, port 5173)       │  HTTP   │  (Node.js, port 5000)    │
│                          │◄───────►│                          │
│  AuthContext (JWT)        │         │  /api/auth   /api/cart   │
│  CartContext (DB-synced)  │         │  /api/products           │
│  WishlistContext (local)  │         │  /api/crafters           │
└──────────────────────────┘         └───────────┬──────────────┘
                                                  │  Prisma Client
                                                  ▼
                                    ┌─────────────────────────────┐
                                    │  PostgreSQL (Supabase)       │
                                    │  users · products            │
                                    │  cart_items · wishlist_items │
                                    └─────────────────────────────┘
```

---

## Schema Diagram

```
users
├── id          TEXT PK
├── name        TEXT
├── email       TEXT UNIQUE
├── password    TEXT (bcrypt hash)
├── role        ENUM(CUSTOMER, CRAFTER)
├── craft       TEXT?
├── createdAt   TIMESTAMP
└── updatedAt   TIMESTAMP
        │
        │ 1──────────────────────────────────────────* products
        │                                              ├── id               SERIAL PK
        │                                              ├── title            TEXT
        │                                              ├── category         TEXT
        │                                              ├── description      TEXT
        │                                              ├── price            FLOAT
        │                                              ├── rating           FLOAT
        │                                              ├── stock            INT
        │                                              ├── image            TEXT
        │                                              ├── images           TEXT[]
        │                                              ├── materials        TEXT[]
        │                                              ├── tags             TEXT[]
        │                                              ├── dimensions       TEXT?
        │                                              ├── deliveryEstimate TEXT?
        │                                              ├── featured         BOOLEAN
        │                                              ├── crafterId        TEXT FK→users
        │                                              ├── createdAt        TIMESTAMP
        │                                              └── updatedAt        TIMESTAMP
        │
        │ 1──* cart_items               │ 1──* wishlist_items
             ├── id         SERIAL PK        ├── id         SERIAL PK
             ├── quantity   INT              ├── createdAt  TIMESTAMP
             ├── userId     FK→users         ├── userId     FK→users
             ├── productId  FK→products      └── productId  FK→products
             ├── createdAt  TIMESTAMP        UNIQUE(userId, productId)
             └── updatedAt  TIMESTAMP
             UNIQUE(userId, productId)
```

**Relationships:**
- `users` 1→N `products` (a crafter lists many products)
- `users` 1→N `cart_items` (a customer has many cart rows)
- `users` 1→N `wishlist_items` (a customer has many wishlist rows)
- `products` 1→N `cart_items` (a product appears in many carts)
- `products` 1→N `wishlist_items` (a product is wishlisted by many users)

All FK relationships use `ON DELETE CASCADE` so deleting a user or product automatically removes all dependent rows.

---

## Installation

### Prerequisites
- Node.js ≥ 18
- A free [Supabase](https://supabase.com) account

### Clone & install

```bash
# Frontend
npm install

# Backend
cd backend
npm install          # also runs prisma generate via postinstall hook
```

---

## Environment Setup

Create `backend/.env` (copy from `backend/.env.example`):

```env
# Supabase pooled connection (Transaction mode) — for the ORM queries
DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# Supabase direct connection (Session mode) — required for Prisma migrations
DIRECT_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"

# JWT signing secret — use a long random string
JWT_SECRET="your_64_char_random_hex_string_here"
JWT_EXPIRES_IN="7d"

PORT=5000
CORS_ORIGIN="http://localhost:5173"
```

---

## Database Setup (Supabase)

### Step 1 — Create a Supabase project
1. Go to [https://supabase.com](https://supabase.com) → **New project**
2. Note your project password

### Step 2 — Get connection strings
1. In your project: **Settings → Database → Connection String**
2. Copy **Transaction mode** URL → paste as `DATABASE_URL` (change port to 6543, add `?pgbouncer=true`)
3. Copy **Session mode** URL → paste as `DIRECT_URL`

### Step 3 — Run migrations
```bash
cd backend
npx prisma migrate deploy   # applies prisma/migrations/20250701000000_init/migration.sql
```

### Step 4 — Seed the database
```bash
npx prisma db seed          # creates demo accounts + all 24 products
```

After seeding you will see:
```
  Demo credentials
  ─────────────────────────────────────────────────
  Customer:  customer@artisanect.com / Customer@123
  Crafter:   crafter@artisanect.com  / Crafter@123
```

### Step 5 — Verify (optional)
```bash
npx prisma studio           # opens a GUI to browse your database
```

---

## Running Locally
```bash
# Terminal 1 — Backend
cd backend
npm run dev           # starts Express on http://localhost:5000

# Terminal 2 — Frontend
npm run dev           # starts Vite on http://localhost:5173
```

Open [http://localhost:5173](http://localhost:5173) and log in using the demo credentials above.

---

## API Endpoints

### Auth  `POST /api/auth/…`
| Method | Path              | Auth | Description             |
|--------|-------------------|------|-------------------------|
| POST   | /auth/register    | —    | Create a new account    |
| POST   | /auth/login       | —    | Login → returns JWT     |
| GET    | /auth/me          | JWT  | Get current user        |
| PUT    | /auth/me          | JWT  | Update name/craft       |

### Products  `GET/POST /api/products/…`
| Method | Path                   | Auth         | Description         |
|--------|------------------------|--------------|---------------------|
| GET    | /products              | —            | All products        |
| GET    | /products/categories   | —            | All categories      |
| GET    | /products/search?q=    | —            | Full-text search    |
| GET    | /products/:id          | —            | Single product      |
| POST   | /products              | CRAFTER JWT  | Create product      |
| PUT    | /products/:id          | CRAFTER JWT  | Update product      |
| DELETE | /products/:id          | CRAFTER JWT  | Delete product      |

### Cart  `GET/POST /api/cart/…`  *(requires any JWT)*
| Method | Path                   | Description             |
|--------|------------------------|-------------------------|
| GET    | /cart                  | Get user's cart         |
| POST   | /cart                  | Add item to cart        |
| PUT    | /cart/:productId       | Update item quantity    |
| DELETE | /cart/:productId       | Remove item from cart   |
| DELETE | /cart/clear            | Clear entire cart       |

### Crafters  `GET/POST /api/crafters/…`  *(requires CRAFTER JWT)*
| Method | Path                   | Description             |
|--------|------------------------|-------------------------|
| GET    | /crafters/products     | Crafter's own products  |
| POST   | /crafters/products     | Upload new product      |
| GET    | /crafters/orders       | Crafter's orders        |
| GET    | /crafters/stats        | Dashboard stats         |

---
## Folder Structure
```
artisanect/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma            ← Prisma data model
│   │   ├── seed.js                  ← Database seeder
│   │   ├── seed-data/
│   │   │   └── products.json        ← 24 seed products
│   │   └── migrations/
│   │       └── 20250701000000_init/ ← Initial migration SQL
│   ├── src/
│   │   ├── controllers/             ← Auth, Products, Cart, Crafters
│   │   ├── routes/                  ← Express routers
│   │   ├── middleware/              ← Auth (JWT), error handler
│   │   ├── lib/prisma.js            ← Prisma client singleton
│   │   └── utils/asyncHandler.js   ← Async error wrapper
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── src/
│   ├── components/                  ← Navbar, Footer, ProductCard, etc.
│   ├── context/                     ← Auth, Cart, Wishlist, Theme
│   ├── pages/                       ← Login, Home, Shop, ProductDetails, etc.
│   ├── services/api.js              ← HTTP client with JWT support
│   └── utils/
├── public/
├── README.md
└── package.json
```

---

## Demo Credentials

| Role     | Email                       | Password     |
|----------|-----------------------------|--------------|
| Customer | customer@artisanect.com     | Customer@123 |
| Crafter  | crafter@artisanect.com      | Crafter@123  |

---

## Future Improvements

- Real checkout & payments (Razorpay / Stripe)
- Order management system with status tracking
- Review & rating system per product
- Crafter analytics dashboard (Charts)
- Image upload to Supabase Storage (replace base64)
- Pagination on product listing
- Email notifications (Resend / SendGrid)
- Deployment to Vercel (frontend) + Render (backend)

## Project structure

```
artisanect/
├── backend/                  # Express REST API (see "How to run backend locally")
│   ├── server.js
│   └── src/
│       ├── routes/           # products, cart, crafters, auth
│       ├── controllers/
│       ├── data/             # in-memory product/cart/user stores
│       └── middleware/       # 404 + centralised error handler
├── src/                      # React frontend
│   ├── services/api.js       # single API layer — every fetch call lives here
│   ├── context/              # Theme, Auth, Cart, Wishlist providers
│   ├── components/
│   │   ├── ui/                # reusable UI library (Button, Input, Modal, Toast, Loader)
│   │   ├── ProductCard.jsx, ProductCatalog.jsx, RecentlyViewed.jsx
│   │   └── RequireRole.jsx    # route guard based on logged-in role
│   ├── utils/recentlyViewed.js
│   └── pages/
├── .env.example               # frontend env var template
└── backend/.env.example       # backend env var template
```

## How to run the frontend locally

```bash
npm install
npm run dev
```
Runs on `http://localhost:5173` by default. Copy `.env.example` to `.env` if you need to point at a backend running somewhere other than `http://localhost:5000`.

## How to run backend locally

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

This starts the Express server on `http://localhost:5000` (configurable via `PORT` in `.env`). `npm run dev` uses `nodemon` to restart on file changes; use `npm start` for a plain `node server.js` run.

For the frontend to talk to it, make sure the frontend's `.env` has:
```
VITE_API_BASE_URL=http://localhost:5000/api
```

### Environment variables (backend)

| Variable | Description | Default |
|---|---|---|
| `PORT` | Port the Express server listens on | `5000` |
| `FRONTEND_ORIGIN` | Origin allowed by CORS | `http://localhost:5173` |

### API reference

All routes are prefixed with `/api`. Data is stored in memory and resets whenever the server restarts — a real database is planned for a future week.

**Products**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/products` | List all products (optional `?category=`) |
| GET | `/products/categories` | Distinct list of categories |
| GET | `/products/search?q=...` | Search by title, category, description, or artisan |
| GET | `/products/:id` | Get a single product |
| POST | `/products` | Create a product |
| PUT | `/products/:id` | Update a product |
| DELETE | `/products/:id` | Delete a product |

**Cart** (single demo cart, not per-user yet)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/cart` | List current cart items |
| POST | `/cart` | Add an item (merges quantity if already present) |
| PUT | `/cart/:id` | Update an item's quantity (`:id` = productId) |
| DELETE | `/cart/:id` | Remove an item (`:id` = productId) |

**Crafters**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/crafters/products` | Products belonging to the demo crafter |
| POST | `/crafters/products` | Crafter uploads a new product |

**Auth (dummy — no real passwords/sessions)**
| Method | Endpoint | Description |
|---|---|---|
| POST | `/login` | Body `{ role: "customer" \| "crafter" }` → demo profile + token |
| GET | `/profile?role=...` | Demo profile for that role |

**Misc**
| Method | Endpoint | Description |
|---|---|---|
| GET | `/stats` | Dashboard summary stats (products, orders, revenue) |

Note: the backend accepts JSON bodies up to 10MB (`express.json({ limit: "10mb" })`), since the Upload Product form sends images as base64 data URLs.

## Running both together

You'll need two terminals: one running `npm run dev` inside `backend/`, and one running `npm run dev` at the project root for the frontend. With both running:
1. Go to `/login` and pick **Customer** or **Crafter**.
2. As a customer: Home/Shop pull live products, Cart/Wishlist/Profile all hit the backend.
3. As a crafter: Dashboard shows live stats, Upload Product posts straight to the catalog, My Products lets you edit/delete what you've uploaded.
