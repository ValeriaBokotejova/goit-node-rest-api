import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";
import gravatar from "gravatar";
import fs from "node:fs/promises";
import path from "node:path";

const { JWT_SECRET = "devsecret", JWT_EXPIRES_IN = "1d" } = process.env;
const avatarsDir = path.resolve("public", "avatars");

export const register = async (req, res, next) => {
  try {
    const email = req.body.email.toLowerCase();
    const exists = await User.findOne({ where: { email } });
    if (exists) return next(HttpError(409, "Email in use"));

    const hash = await bcrypt.hash(req.body.password, 10);
    const avatarURL = gravatar.url(email, { s: "250", d: "identicon" }, true);
    const user = await User.create({ email, password: hash, avatarURL });

    res.status(201).json({ user: { email: user.email, subscription: user.subscription } });
  } catch (e) { next(e); }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) return next(HttpError(401, "Email or password is wrong"));

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