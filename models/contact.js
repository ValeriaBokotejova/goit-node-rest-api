import { DataTypes } from "sequelize";
import { sequelize } from "../db/sequelize.js";
import User from "./user.js";

const Contact = sequelize.define(
  'contact', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    favorite: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    owner: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  {
    tableName: "contacts",
    timestamps: false,
  }
);

Contact.belongsTo(User, { foreignKey: "owner", as: "user" });
User.hasMany(Contact, { foreignKey: "owner", as: "contacts" });

export default Contact;