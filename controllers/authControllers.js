import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";

const { JWT_SECRET = "devsecret", JWT_EXPIRES_IN = "1d" } = process.env;

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const exists = await User.findOne({ where: { email } });
    if (exists) return next(HttpError(409, "Email in use"));

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hash });

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
