import UserModel from "../../models/user/index.js";
import "dotenv/config";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import generateOTP from "../../utils/otpGenerator.js";
import nodemailer from "nodemailer";
import {
  BAD_REQUEST,
  INVALID_CREDENTIALS,
  NOT_FOUND,
  SERVER_ERROR,
  SUCCESS,
} from "../../utils/statusCodes.js";

const AuthController = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(NOT_FOUND).json({ message: "USER NOT FOUND" });
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      return res.status(BAD_REQUEST).json({ message: "WRONG CREDENTIALS" });
    }
    console.log(user.role);
    const token = JWT.sign(
      { id: user.id, email, password, role: user.role },
      process.env.AUTH_TOKEN_SECRET,
      { expiresIn: "300m" }
    );
    if (token.error) {
      res.json({ error: token.error });
    }
    res.json({ message: "LOGIN SUCESSFULL", token });
  },
  register: async (req, res) => {
    try {
      const {
        name,
        email,
        password,
        role,
        joining_date,
        phone,
        city,
        is_active,
      } = req.body;
      const saltRounds = 10;
      const hpassword = await bcrypt.hash(password, saltRounds);
      const doUserAlreadyExist = await UserModel.findOne({ where: { email } });
      if (doUserAlreadyExist) {
        return res.json({ message: "This Email Already Exist" });
      }
      const user = await UserModel.create({
        name,
        email,
        password: hpassword,
        role,
        joining_date,
        phone,
        city,
        is_active,
      });
      res.json({
        message: "User Created",
        name,
        email,
        role,
        joining_date,
        phone,
        city,
        is_active,
      });
    } catch (error) {
      return res
        .status(SERVER_ERROR)
        .json({ message: "Server Error", error: error });
    }
  },
  forgotPasswordByOtp: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        return res
          .status(INVALID_CREDENTIALS)
          .json({ message: "Invalid Email!" });
      }
      const otp = generateOTP();
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        auth: {
          user: process.env.SMTP_EMAIL,
          pass: process.env.SMTP_PASSWORD,
        },
      });
      console.log(transporter);
      await nodemailer.createTestAccount();
      let info = await transporter.sendMail({
        from: `"Mutual Human Diary" <${process.env.SMTP_EMAIL}>`,
        to: user.email,
        subject: "Reset Password",
        html: `<b>Hello ${user.name} this is your otp for change password: ${otp}</b>`,
      });
      console.log("This is email ", info.accepted[0]);
      console.log("This is rejected ", info.rejected[0]);
      if (info.accepted[0] != null) {
        const currentTime = new Date();
        user.otp = otp;
        user.otp_sent_time = currentTime;
        await user.save();
        res.status(SUCCESS).json({
          success: 0,
          message: "OTP sent successfully to this email",
          result: { email: user.email, otp },
        });
      } else {
        return res.status(BAD_REQUEST).json({ error: "Error Sending OTP" });
      }
    } catch (error) {
      console.log(error);
      return res.status(SERVER_ERROR).json({ message: "Server Error", error });
    }
  },
  verifyOtp: async (req, res) => {
    try {
      const { email, otp } = req.body;
      const user = await UserModel.findOne({ where: { email } });
      if (!user) {
        return res
          .status(INVALID_CREDENTIALS)
          .json({ message: "Invalid Email!" });
      }
      const currentDate = new Date();
      const startDate = user.otp_sent_time;
      const diffTime = Math.abs(currentDate - startDate) / 1000;

      if (diffTime > 120) {
        res.status(BAD_REQUEST).json({
          message: "Please resend the OTP as the time limit has been exceeded",
        });
      } else {
        if (otp == user.otp) {
          user.otp = "";
          await user.save();

          res.status(SUCCESS).json({ success: 1, message: "OTP verified" });
        } else {
          res.status(BAD_REQUEST).json({ message: "Invalid OTP" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(SERVER_ERROR).json({ message: "Server Error", error });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const decodedToken = JWT.verify(
        req.params.token,
        process.env.JWT_SIGNATURE
      );

      console.log(req.params.token);

      if (!decodedToken) {
        return res
          .status(INVALID_CREDENTIALS)
          .send({ message: "Invalid token" });
      }

      const user = await UserModel.findOne({
        where: { email: decodedToken.email },
      });
      if (!user) {
        return res
          .status(INVALID_CREDENTIALS)
          .send({ message: "no user found" });
      }

      const salt = await bcrypt.genSalt(10);
      const newPassword = await bcrypt.hash(req.body.newPassword, salt);

      user.password = newPassword;
      await user.save();

      return res.status(200).send({ message: "Password updated" });
    } catch (err) {
      res.status(500).send({ message: err.message });
    }
  },
};
export default AuthController;
