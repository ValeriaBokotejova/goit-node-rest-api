# Auth (JWT) + PostgreSQL

Adds user authentication/authorization with JWT on top of the contacts API

### Environment

Create .env (use .env.example as a template)

### Install & Run

```bash
npm i
# development (auto-restart)
npm run dev
# or regular start
npm start
```

### Auth Endpoints

**Base:** http://localhost:3000/api/auth

- POST /register
Body: { "email": "a@b.c", "password": "secret123" }
→ 201 { "user": { "email", "subscription":"starter" } }
Conflicts: 409 { "message":"Email in use" }

- POST /login
Body: { "email", "password" }
→ 200 { "token", "user": { "email", "subscription" } }
Errors: 400 (validation), 401 { "message":"Email or password is wrong" }

- GET /current (requires Bearer <token>)
→ 200 { "email", "subscription" } or 401 { "message":"Not authorized" }

- POST /logout (Bearer)
→ 204 No Content (token cleared)

- (optional) PATCH /subscription (Bearer)
Body: { "subscription": "starter|pro|business" } → 200 { email, subscription }


### Contacts (protected)

**Base URL:** http://localhost:3000/api/contacts

- GET /api/contacts → 200 Array of contacts

- GET /api/contacts/:id → 200 Contact or 404 { "message": "Not found" }

- POST /api/contacts → 201 Created contact
Body (JSON, required): { "name", "email", "phone" } (+ optional "favorite")

- PUT /api/contacts/:id → 200 Updated contact
Body must have at least one of: name|email|phone|favorite
Empty body → 400 { "message": "Body must have at least one field" }

- PATCH /api/contacts/:id/favorite → 200 Updated contact
Body: { "favorite": true|false } (required)

- DELETE /api/contacts/:id → 200 Deleted contact or 404

