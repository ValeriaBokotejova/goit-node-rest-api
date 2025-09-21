import express from "express";
import { register, login, logout, current, updateSubscription } from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema, updateSubscriptionSchema } from "../schemas/authSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import { updateAvatar } from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, current);

router.patch("/subscription", authenticate, validateBody(updateSubscriptionSchema), updateSubscription);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

export default router;
