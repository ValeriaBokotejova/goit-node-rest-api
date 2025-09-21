# Contacts REST API — Email Verification

Adds email verification via Nodemailer (Gmail SMTP) on top of auth-enabled API

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

### Endpoints

**Base:** http://localhost:3000/api/auth

- POST /register
Body: { "email": "me@example.com", "password": "secret123" }
→ 201 { user: { email, subscription } } (email sent)

- GET /verify/:verificationToken
First time → 200 { "message": "Verification successful" }
Revisit → 404 { "message": "User not found" }

- POST /verify (resend)
Body (JSON): { "email": "me@example.com" }
→ 200 { "message": "Verification email sent" }
If already verified → 400 { "message": "Verification has already been passed" }
If no email in body → 400 { "message": "missing required field email" } (or Joi message)

- POST /login
Body: { "email","password" }
Not verified → 401 { "message": "Email is not verified" }
Verified → 200 { token, user }

- GET /current (Bearer) → 200 { email, subscription }

- POST /logout (Bearer) → 204

### Quick testing (Postman)

1. Register → check Gmail inbox (or Spam) for a link like:

`${BASE_URL}/api/auth/verify/<token>`

2. Open the link:

    - 1st time: 200 "Verification successful"

    - 2nd time: 404 "User not found"

3. Login before verify → 401; after verify → 200 with token.

4. Resend: POST /api/auth/verify with raw JSON { "email": "..." } and header Content-Type: application/json.