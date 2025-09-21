# Contacts REST API - Avatars

Adds user avatars to the auth-enabled API: Gravatar on registration + file upload via Multer.
Stack: Node.js, Express, PostgreSQL, Sequelize, Joi, bcryptjs, jsonwebtoken, multer, gravatar

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

### Endpoints (auth-related)

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

- PATCH /avatars (Bearer, multipart/form-data) → 200 { "avatarURL": "/avatars/<file>" }

### Quick checks

**Static**

Put an image into public/avatars/test.png → open
http://localhost:3000/avatars/test.png (should load 🖼️)

**Postman upload**

1. Login → copy token.

2. PATCH http://localhost:3000/api/auth/avatars

    - Auth → Bearer Token

    - Body → form-data → Key: avatar (type File), choose an image

3. Response:

```json
{ "avatarURL": "/avatars/<userId>_<timestamp>.png" }
```