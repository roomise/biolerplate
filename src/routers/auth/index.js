import { Router } from "express";
import AuthController from "../../controllers/auth/index.js";
import AuthValidator from "../../validators/auth/index.js";
const AuthRouter = Router();
AuthRouter.post("/register", AuthValidator.register, AuthController.register);
AuthRouter.post("/login", AuthValidator.login, AuthController.login);
AuthRouter.post(
  "/send-otp",
  AuthValidator.sendOtp,
  AuthController.forgotPasswordByOtp
);
AuthRouter.post(
  "/verify-otp",
  AuthValidator.verifyOtp,
  AuthController.verifyOtp
);
export default AuthRouter;
