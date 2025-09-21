import jwt from "jsonwebtoken";
import HttpError from "../helpers/HttpError.js";
import User from "../models/user.js";

const isProd = process.env.NODE_ENV === "production";
const JWT_SECRET = process.env.JWT_SECRET || (isProd ? null : "devsecret");
if (!JWT_SECRET) throw new Error("JWT_SECRET is required");

const authenticate = async (req, res, next) => {
  try {
    const auth = req.headers.authorization || "";
    const [type, token] = auth.split(" ");
    if (type !== "Bearer" || !token) return next(HttpError(401, "Not authorized"));

    let payload;
    try {
      payload = jwt.verify(token, JWT_SECRET);
    } catch {
      return next(HttpError(401, "Not authorized"));
    }

    const user = await User.findByPk(payload.id);
    if (!user || user.token !== token) return next(HttpError(401, "Not authorized"));

    req.user = { id: user.id, email: user.email, subscription: user.subscription };
    next();
  } catch (e) { next(e); }
};

export default authenticate;
