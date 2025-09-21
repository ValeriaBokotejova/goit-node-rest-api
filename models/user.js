import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";

const User = sequelize.define("user", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },

  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },

  subscription: {
    type: DataTypes.ENUM,
    values: ["starter", "pro", "business"],
    defaultValue: "starter",
  },

  avatarURL: { type: DataTypes.STRING, allowNull: true },

  token: { type: DataTypes.STRING, allowNull: true, defaultValue: null },

  verify: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  verificationToken: { type: DataTypes.STRING, allowNull: true },
}, {
  tableName: "users",
  timestamps: false,
});

export default User;
