import express from "express";
import morgan from "morgan";
import cors from "cors";

import contactsRouter from "./routes/contactsRouter.js";

const app = express();

app.get("/", (_, res) => {
  res.type("html").send(`
    <style>body{font-family:system-ui;padding:24px;line-height:1.5}</style>
    <h1>goit-node-rest-api</h1>
    <p>API is running. Try:</p>
    <ul>
      <li><code>GET /api/contacts</code></li>
      <li><code>GET /api/contacts/:id</code></li>
      <li><code>POST /api/contacts</code></li>
      <li><code>PUT /api/contacts/:id</code></li>
      <li><code>DELETE /api/contacts/:id</code></li>
    </ul>
  `);
});

app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.use("/api/contacts", contactsRouter);

app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

app.listen(3000, () => {
  console.log("Server is running. Use our API on port: 3000");
});