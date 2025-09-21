# PostgreSQL + Sequelize

REST API for managing contacts using Node.js + Express, PostgreSQL, and Sequelize

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

