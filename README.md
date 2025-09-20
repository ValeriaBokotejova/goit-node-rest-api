# Node REST API

Simple REST API for managing a contacts collection using Node.js + Express.
This project includes CRUD operations for contacts

### Setup

- clone repo

- install dependencies

```bash
npm i
```

### Run

```bash
# development (with auto-restart)
npm run dev
# or regular start
npm start
```

Server starts on http://localhost:3000

### Endpoints

Base path: http://localhost:3000/api/contacts

- GET http://localhost:3000/api/contacts — get all contacts (200)

- GET http://localhost:3000/api/contacts/:id — get contact by id (200 or 404 { "message": "Not found" })

- POST http://localhost:3000/api/contacts — create contact (201)
Body (JSON, all fields required):
```json
{ "name": "Alice Example", "email": "alice@example.com", "phone": "123-456-7890" }
```

- PUT http://localhost:3000/api/contacts/:id — update any subset of fields (200)
Body must contain at least one of: name, email, phone.

- DELETE http://localhost:3000/api/contacts/:id — delete by id (200 or 404)
