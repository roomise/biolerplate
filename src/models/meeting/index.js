import { DataTypes } from "sequelize";
import sequelize from "../../db/config.js";
import UserModel from "../user/index.js";

const MeetingModel = sequelize.define(
  "Meetings",
  {
    agent_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    time_slot: {
      type: DataTypes.STRING,
    },
    meeting_date: {
      type: DataTypes.STRING,
    },
    meeting_with: {
      type: DataTypes.STRING,
    },
    status: {
      type: DataTypes.STRING,
    },
    cancel_person: {
      type: DataTypes.STRING,
    },
  },
  {}
);

UserModel.hasMany(MeetingModel);
MeetingModel.belongsTo(UserModel);

export default MeetingModel;
