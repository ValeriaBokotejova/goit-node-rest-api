import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize({
  dialect: process.env.DATABASE_DIALECT || "postgres",
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT || 5432),
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  logging: false,
  dialectOptions: (process.env.DB_SSL === "true")
    ? { ssl: { require: true, rejectUnauthorized: false } }
    : {},
});

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection successful");
  } catch (err) {
    console.error(`❌ Database connection error: ${err.message}`);
    process.exit(1);
  }
}