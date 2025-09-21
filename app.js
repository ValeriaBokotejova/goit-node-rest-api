import express from "express";
import morgan from "morgan";
import cors from "cors";

import { connectDB } from "./db/sequelize.js";
import contactsRouter from "./routes/contactsRouter.js";
import authRouter from "./routes/authRouter.js";

const app = express();

// Middlewares
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.json({ message: "OK. Use /api/contacts" });
});

// Routes
app.use("/api/auth", authRouter);
app.use("/api/contacts", contactsRouter);

// 404
app.use((_, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

const PORT = process.env.PORT || 3000;

// Start only after DB is up
(async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server is running. Use our API on port: ${PORT}`);
  });
})();