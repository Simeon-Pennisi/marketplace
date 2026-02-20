# TechMarket (Marketplace Demo)

Full-stack marketplace demo for used/refurbished tech gear.

## Live API (Render)

Base URL:

- https://marketplace-demo-lx2a.onrender.com

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
