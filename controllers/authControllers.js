import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import gravatar from "gravatar";
import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import sendEmail from "../helpers/sendEmail.js";

const {
  JWT_SECRET = "devsecret",
  JWT_EXPIRES_IN = "1d",
  BASE_URL = "http://localhost:3000",
} = process.env;

const avatarsDir = path.resolve("public", "avatars");

export const register = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const exists = await User.findOne({ where: { email } });
    if (exists) return next(HttpError(409, "Email in use"));

    const hash = await bcrypt.hash(req.body.password, 10);
    const avatarURL = gravatar.url(email, { s: "250", d: "identicon" }, true);

    const verificationToken = nanoid();
    const user = await User.create({
      email,
      password: hash,
      avatarURL,
      verify: false,
      verificationToken,
    });

    const verifyLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your email",
      html: `<p>Hi!</p><p>Please verify your email:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`,
    });

    res.status(201).json({
      user: { email: user.email, subscription: user.subscription },
    });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) return next(HttpError(401, "Email or password is wrong"));

    if (!user.verify) return next(HttpError(401, "Email is not verified"));

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return next(HttpError(401, "Email or password is wrong"));

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    await User.update({ token }, { where: { id: user.id } });

    res.status(200).json({ token, user: { email: user.email, subscription: user.subscription } });
  } catch (e) { next(e); }
};

export const logout = async (req, res, next) => {
  try {
    await User.update({ token: null }, { where: { id: req.user.id } });
    res.status(204).send();
  } catch (e) { next(e); }
};

export const current = async (req, res, next) => {
  try {
    const { email, subscription } = req.user;
    res.status(200).json({ email, subscription });
  } catch (e) { next(e); }
};

export const updateSubscription = async (req, res, next) => {
  try {
    const { subscription } = req.body;
    await User.update({ subscription }, { where: { id: req.user.id } });
    const u = await User.findByPk(req.user.id);
    res.status(200).json({ email: u.email, subscription: u.subscription });
  } catch (e) { next(e); }
};

export const updateAvatar = async (req, res, next) => {
  try {
    if (!req.file) return next(HttpError(400, "No file uploaded"));

    const ext = path.extname(req.file.originalname).toLowerCase();
    const filename = `${req.user.id}_${Date.now()}${ext}`;
    const destPath = path.join(avatarsDir, filename);

    await fs.rename(req.file.path, destPath);

    const avatarURL = `/avatars/${filename}`;
    await User.update({ avatarURL }, { where: { id: req.user.id } });

    res.status(200).json({ avatarURL });
  } catch (e) {
    if (req.file) { try { await fs.unlink(req.file.path); } catch {}
    }
    next(e);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ where: { verificationToken } });
    if (!user) return next(HttpError(404, "User not found"));

    await User.update({ verify: true, verificationToken: null }, { where: { id: user.id } });
    res.status(200).json({ message: "Verification successful" });
  } catch (e) { next(e); }
};

export const resendVerifyEmail = async (req, res, next) => {
  try {
    const email = (req.body.email || "").toLowerCase();
    if (!email) return next(HttpError(400, "missing required field email"));

    const user = await User.findOne({ where: { email } });
    if (!user) return next(HttpError(404, "User not found"));
    if (user.verify) return next(HttpError(400, "Verification has already been passed"));

    let { verificationToken } = user;
    if (!verificationToken) {
      verificationToken = nanoid();
      await User.update({ verificationToken }, { where: { id: user.id } });
    }

    const verifyLink = `${BASE_URL}/api/auth/verify/${verificationToken}`;
    await sendEmail({
      to: email,
      subject: "Verify your email (resend)",
      html: `<p>Verify your email:</p><p><a href="${verifyLink}">${verifyLink}</a></p>`,
    });

    res.status(200).json({ message: "Verification email sent" });
  } catch (e) { next(e); }
};