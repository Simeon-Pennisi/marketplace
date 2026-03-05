# TechMarket (Marketplace Demo)

Full-stack marketplace demo for used/refurbished tech gear.

## Live API (Render)

Base URL:

https://marketplace-demo-lx2a.onrender.com

### Health

```bash
curl -i https://marketplace-demo-lx2a.onrender.com/api/health
```

### Public listings

```bash
curl -i https://marketplace-demo-lx2a.onrender.com/api/listings
```

### New User Registration

```bash
curl -i -X POST https://marketplace-demo-lx2a.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"USER_EMAIL","password":"USER_PASSWORD"}'
```

### Login

```bash
curl -i -X POST https://marketplace-demo-lx2a.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@testuseremail.com","password":"YOUR_PASSWORD"}'
```

### Capture token

```bash
export TOKEN="PASTE_TOKEN_HERE"
```

### Get user's listings

```bash
curl -i https://marketplace-demo-lx2a.onrender.com/api/listings/mine \
  -H "Authorization: Bearer $TOKEN"
```

### Create new listing

# Allowed conditions = "new", "like_new", "good", "fair"

# Allowed categories = "monitor", "laptop", "audio", "accessories"

```bash
curl -i -X POST https://marketplace-demo-lx2a.onrender.com/api/listings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title":"Sample listing",
    "price_cents":6799,
    "condition":"good",
    "category":"monitor",
    "brand":"Dell",
    "technical_specs":"Old but works great",
    "image_url":"https://via.placeholder.com/400x300?text=Monitor"
  }'
```

### Edit listing

```bash
curl -i -X PATCH https://marketplace-demo-lx2a.onrender.com/api/listings/ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"price_cents":6499}'
```

### Delete listing

```bash
curl -i -X DELETE https://marketplace-demo-lx2a.onrender.com/api/listings/LISTING_ID_HERE \
  -H "Authorization: Bearer $TOKEN"
```

###

```bash

```

# Tech Stack

## Frontend

React (Vite) single-page app (SPA)

React Router for client-side routing

AuthContext for JWT session lifecycle (hydrate /me, auto-logout on exp, warning notices)

Fetch API with Authorization: Bearer <token>

## Backend

Node.js + Express REST API (/api/\*)

JWT auth (HS256) using JWT_SECRET

## Middleware:

requireAuth (validates Bearer token, sets req.user)

requireOwner (enforces seller ownership on protected listing mutations)

CORS allowlist for local + deployed frontend origins

## Database

PostgreSQL (Render managed)

Relational constraints for integrity:

foreign keys with cascading deletes

unique constraints (ex: unique users.email, unique (listing_id, user_id) for favorites)

check constraints for enums (listing condition, category)

## Seed scripts:

idempotent upserts for stable demo accounts

deterministic sample listings / favorites / reviews / orders

Deployment

Frontend: Render Static Site

Backend: Render Web Service

DB: Render PostgreSQL

Config via Render Environment Variables / Environment Groups:

DATABASE_URL

JWT_SECRET

JWT_EXPIRES_IN

# High Level View

┌───────────────────────────┐
│ Client: React (Vite)
│ - React Router
│ - AuthContext (JWT)
└───────────────┬───────────┘
│ HTTPS (fetch)
│ Authorization: Bearer <JWT>
▼
┌───────────────────────────┐
│ API: Node + Express
│ /api/auth/_
│ /api/listings/_
│ Middleware:
│ - requireAuth
│ - requireOwner
└───────────────┬───────────┘
│ SQL (pg Pool)
▼
┌───────────────────────────┐
│ PostgreSQL (Render)
│ users / listings / ...
│ constraints + indexes
└───────────────────────────┘

# ER Diagram

flowchart TB
subgraph FE[Frontend: React (Vite) SPA]
R[React UI]
AR[AuthContext<br/>- store token<br/>- hydrate /me<br/>- auto-logout on exp]
RR[React Router]
R --> RR
R --> AR
end

subgraph BE[Backend: Express REST API]
API[Express App<br/>/api/*]
AUTH[Auth Routes<br/>/api/auth/register<br/>/api/auth/login<br/>/api/auth/me]
LIST[Listings Routes<br/>/api/listings<br/>/api/listings/:id<br/>/api/listings/mine]
MW1[requireAuth<br/>Verify JWT -> req.user]
MW2[requireOwner<br/>Check seller_id matches]
API --> AUTH
API --> LIST
LIST --> MW1
LIST --> MW2
end

subgraph DB[Database: PostgreSQL (Render)]
U[(users)]
L[(listings)]
F[(favorites)]
RV[(reviews)]
O[(orders)]
OI[(order_items)]
end

FE -->|HTTPS fetch<br/>Authorization: Bearer JWT| BE
BE -->|pg Pool (SQL)| DB

U --> L
U --> F
U --> RV
U --> O
O --> OI
OI --> L

# Auth + Protected Actions

Login/Register returns:

user (id/email)

token (JWT with exp)

Frontend stores token and sends it in every protected request:

Authorization: Bearer <token>

Protected listing routes require:

requireAuth → validates JWT and sets req.user

requireOwner → fetches listing’s seller_id and enforces ownership for mutations (PATCH/DELETE)

## Environment Configuration

Production config is provided via Render Environment Variables:

DATABASE_URL (Render Postgres connection string)

JWT_SECRET (JWT signing key)

JWT_EXPIRES_IN (token TTL, e.g. 15m)

erDiagram
USERS {
int id PK
varchar name
varchar email "UNIQUE"
varchar password_hash
timestamptz created_at
timestamptz updated_at
}

LISTINGS {
int id PK
int seller_id FK
varchar title
int price_cents
varchar condition
varchar category
varchar brand
text technical_specs
text image_url
timestamptz created_at
timestamptz updated_at
boolean is_active
}

FAVORITES {
int id PK
int user_id FK
int listing_id FK
timestamptz created_at
}

REVIEWS {
int id PK
int user_id FK
int listing_id FK
int rating
text comment
timestamptz created_at
}

ORDERS {
int id PK
int buyer_id FK
int total_cents
int tax_cents
int shipping_cents
varchar status
timestamptz created_at
}

ORDER_ITEMS {
int id PK
int order_id FK
int listing_id FK
int price_cents "price-at-purchase"
int quantity
}

USERS ||--o{ LISTINGS : "sells"
USERS ||--o{ FAVORITES : "favorites"
USERS ||--o{ REVIEWS : "writes"
USERS ||--o{ ORDERS : "places"

LISTINGS ||--o{ FAVORITES : "is_favorited"
LISTINGS ||--o{ REVIEWS : "has"
ORDERS ||--o{ ORDER_ITEMS : "contains"
LISTINGS ||--o{ ORDER_ITEMS : "purchased_as"
