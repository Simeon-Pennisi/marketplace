# TechMarket

### Full-Stack Marketplace Demo (PERN Stack)

A production-style marketplace application built with the PERN stack (PostgreSQL, Express, React, Node.js) demonstrating authenticated CRUD operations, relational data modeling, ownership-based authorization, and cloud deployment.

This project focuses on backend architecture, API design, and secure full-stack integration, rather than purely UI features.

## Live Demo

Frontend  
https://marketplace-client-cvgy.onrender.com

Backend API  
https://marketplace-demo-lx2a.onrender.com

Health check

```bash
curl -i https://marketplace-demo-lx2a.onrender.com/api/health
```

## Demo Accounts

These accounts are seeded automatically.

| User         | Email               | Password       |
| ------------ | ------------------- | -------------- |
| Demo User    | demo@techmarket.dev | DemoUser2026!  |
| Alice Seller | alice@example.com   | AlicePass2026! |
| Bob Buyer    | bob@example.com     | BobPass2026!   |

## Key Features

#### Authentication

- JWT-based authentication
- bcrypt password hashing
- token expiration with auto-logout

#### Authorization

- ownership middleware ensures users can only modify their own listings

#### Listings

- create listings
- edit listings
- delete listings
- browse marketplace inventory

#### Marketplace Interaction

- favorites
- reviews
- simulated orders

#### Database Integrity

- foreign key constraints
- composite unique constraints
- enum validation via CHECK constraints

#### Deployment

- full production deployment via Render
- environment-based configuration
- idempotent seed scripts

<p></p>

# Tech Stack

## Frontend

- React
- Vite
- React Router
- Context API
- Fetch API

### Features

- protected routes
- session persistence
- auto logout on token expiration

## Backend

- Node.js
- Express
- JWT authentication
- middleware-based authorization

### Middleware

| Middleware   | Purpose                   |
| ------------ | ------------------------- |
| requireAuth  | verifies JWT token        |
| requireOwner | ensures listing ownership |

## Database

PostgreSQL (Render managed)

### Core tables

- users
- listings
- favorites
- reviews
- orders
- order_items

### Schema features

- foreign key constraints
- cascade deletes
- enum validation
- composite uniqueness rules

<p></p>

# System Architecture

## High-Level Overview

<!-- fix this later -->

React SPA (Vite)
│
│ HTTPS API Requests
│ Authorization: Bearer <JWT>
▼
Express API Server
│
│ SQL Queries
▼
PostgreSQL Database

## Architecture Diagram

<!-- mermaid -->

flowchart TB

subgraph Client
A[React App]
B[AuthContext]
C[React Router]
end

subgraph Server
D[Express API]
E[requireAuth]
F[requireOwner]
end

subgraph Database
G[(PostgreSQL)]
end

A --> C
A --> B
C -->|API calls| D
B -->|JWT token| D

D --> E
D --> F
E --> G
F --> G

## Data Model

erDiagram

USERS {
int id PK
varchar name
varchar email
varchar password_hash
}

LISTINGS {
int id PK
int seller_id FK
varchar title
int price_cents
varchar condition
varchar category
}

FAVORITES {
int user_id FK
int listing_id FK
}

REVIEWS {
int id PK
int user_id FK
int listing_id FK
int rating
}

ORDERS {
int id PK
int buyer_id FK
int total_cents
}

ORDER_ITEMS {
int id PK
int order_id FK
int listing_id FK
}

USERS ||--o{ LISTINGS : sells
USERS ||--o{ FAVORITES : favorites
USERS ||--o{ REVIEWS : writes
USERS ||--o{ ORDERS : places

LISTINGS ||--o{ FAVORITES : favorited
LISTINGS ||--o{ REVIEWS : reviewed
ORDERS ||--o{ ORDER_ITEMS : contains
LISTINGS ||--o{ ORDER_ITEMS : purchased

## API Endpoints

### Public

Get listings

```bash
curl -i https://marketplace-demo-lx2a.onrender.com/api/listings
```

Health

```bash
curl -i https://marketplace-demo-lx2a.onrender.com/api/health
```

### Authentication

Register

```bash
curl -i -X POST https://marketplace-demo-lx2a.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"USER_EMAIL","password":"USER_PASSWORD"}'
```

Login

```bash
curl -i -X POST https://marketplace-demo-lx2a.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"testuser@testuseremail.com","password":"YOUR_PASSWORD"}'
```

Capture token

```bash
export TOKEN="PASTE_TOKEN_HERE"
```

### Protected Routes

Create new listing
| Allowed conditions | Allowed categories |
| :---: | :---: |
|"new", "like_new", "good", "fair" | "monitor", "laptop", "audio", "accessories" |

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

Get user's listings

```bash
curl -i https://marketplace-demo-lx2a.onrender.com/api/listings/mine \
  -H "Authorization: Bearer $TOKEN"
```

Edit listing

```bash
curl -i -X PATCH https://marketplace-demo-lx2a.onrender.com/api/listings/ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"price_cents":6499}'
```

Delete listing

```bash
curl -i -X DELETE https://marketplace-demo-lx2a.onrender.com/api/listings/LISTING_ID_HERE \
  -H "Authorization: Bearer $TOKEN"
```

## Local Development

#### Clone repository

```bash
git clone https://github.com/YOUR_USERNAME/marketplace
```

Install dependencies

```bash
npm install
```

Run backend

```bash
cd server
npm run dev
```

Run frontend

```bash
cd client
npm run dev
```

Seed database

```bash
node src/db/seed.js
```

### Environment Variables

Backend requires

```bash
DATABASE_URL
JWT_SECRET
JWT_EXPIRES_IN
NODE_ENV
```

Frontend requires

```bash
VITE_API_BASE_URL
```

## Redeployment Instructions

This project is designed for easy redeployment.

1. Create PostgreSQL database
2. Set environment variables
3. Deploy backend service
4. Deploy frontend static site
5. Run seed script

## Security Features

- JWT authentication
- bcrypt password hashing
- ownership-based authorization
- strict CORS configuration
- environment variable secrets

## Engineering Highlights

- idempotent seed scripts with upserts
- cents-based currency storage
- middleware separation of auth vs ownership
- normalized relational schema
- production deployment pipeline

## Future Improvements

- [ ] payment integration
- [ ] image uploads
- [ ] search and filtering
- [ ] pagination
- [ ] seller analytics

## License

MIT License
