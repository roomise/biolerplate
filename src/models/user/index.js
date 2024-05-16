import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";

const UserModel = sequelize.define(
  "User",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.STRING,
    },
    is_active: {
      type: DataTypes.STRING,
    },
    phone: {
      type: DataTypes.STRING,
    },
    joining_date: {
      type: DataTypes.DATE,
    },
    city: {
      type: DataTypes.STRING,
    },
    otp: {
      type: DataTypes.STRING,
    },
    otp_sent_time: {
      type: DataTypes.DATE,
    },
  },
  {}
);

export default UserModel;
