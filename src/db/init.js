import MeetingModel from "../models/meeting/index.js";
import UserModel from "../models/user/index.js";

const dbSync = async () => {
  await UserModel.sync({ force: false });
  console.log("The table for the User Model  was just (re)created!");
  await MeetingModel.sync({ force: true });
  console.log("The table for the Meeting model was just (re)created!");
};
export default dbSync;
