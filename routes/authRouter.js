import express from "express";
import { register, login, logout, current, updateSubscription } from "../controllers/authControllers.js";
import validateBody from "../helpers/validateBody.js";
import { registerSchema, loginSchema, updateSubscriptionSchema } from "../schemas/authSchemas.js";
import authenticate from "../middlewares/authenticate.js";
import upload from "../middlewares/upload.js";
import { updateAvatar } from "../controllers/authControllers.js";
import { verifyEmail, resendVerifyEmail } from "../controllers/authControllers.js";
import { resendVerifySchema } from "../schemas/authSchemas.js";

const router = express.Router();

router.post("/register", validateBody(registerSchema), register);

router.post("/login", validateBody(loginSchema), login);

router.post("/logout", authenticate, logout);

router.get("/current", authenticate, current);

router.patch("/subscription", authenticate, validateBody(updateSubscriptionSchema), updateSubscription);

router.patch("/avatars", authenticate, upload.single("avatar"), updateAvatar);

router.get("/verify/:verificationToken", verifyEmail);

router.post("/verify", validateBody(resendVerifySchema), resendVerifyEmail);

export default router;
