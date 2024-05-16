import UserModel from "../../models/user/index.js";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import {
  INVALID_CREDENTIALS,
  SERVER_ERROR,
  SUCCESS,
} from "../../utils/statusCodes.js";
const UserController = {
  updateProfile: async (req, res) => {
    try {
      const { name, email, role, joining_date, phone, city, is_active } =
        req.body;
      const user = await UserModel.findOne({ where: { id: req.user.id } });
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "USER NOT FOUND" });
      }
      if (name) {
        user.name = name;
      }
      if (email) {
        user.email = email;
      }
      if (role) {
        user.role = role;
      }
      if (joining_date) {
        user.joining_date = joining_date;
      }
      if (phone) {
        user.phone = phone;
      }
      if (city) {
        user.city = city;
      }
      if (is_active) {
        user.is_active = is_active;
      }
      await user.save();
      res.status(SUCCESS).json({
        message: "User Updated Sucessfully!",
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        joining_date: user.joining_date,
        phone: user.phone,
        city: user.city,
        is_active: user.is_active,
      });
    } catch (error) {
      return res
        .status(SERVER_ERROR)
        .json({ message: "Server Error", error: error });
    }
  },
  updatePassword: async (req, res) => {
    try {
      const { old_password, new_password } = req.body;
      const user = await UserModel.findOne({ where: { id: req.user.id } });
      if (!user) {
        return res.status(NOT_FOUND).json({ message: "USER NOT FOUND" });
      }

      if (!(await bcrypt.compare(old_password, user.password))) {
        return res
          .status(INVALID_CREDENTIALS)
          .json({ message: "Old Password did not match!" });
      }
      const hashedPassword = await bcrypt.hash(new_password, 10);
      user.password = hashedPassword;
      await user.save();
      res.status(SUCCESS).json({ message: "Password Changed Sucessfully!" });
    } catch (error) {
      return res
        .status(SERVER_ERROR)
        .json({ message: "Server Error", error: error });
    }
  },
  getAllUsers: async (req, res) => {
    try {
      console.log(req.user.role);
      if (req.user.role !== "Admin") {
        return res.status(INVALID_CREDENTIALS).json({
          message:
            "You Are Not Authorized To Access This Informantion Only Admin Has The Access",
        });
      }
      const users = await UserModel.findAll({
        where: { id: { [Op.ne]: req.user.id } },
        attributes: [
          "id",
          "name",
          "role",
          "city",
          "phone",
          "joining_date",
          "is_active",
        ],
      });
      if (!users) {
        return res.status(NOT_FOUND).json({ message: "NO USER FOUND" });
      }
      res.status(SUCCESS).json({ message: "Fetched Users Sucessfully", users });
    } catch (error) {
      console.log(error);
      return res.status(SERVER_ERROR).json({ message: "Server Error", error });
    }
  },
};
export default UserController;
