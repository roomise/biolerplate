import { Router } from "express";
import AuthenticationMiddleware from "../../middlewares/authentication.js";
import UserController from "../../controllers/user/index.js";
import UserValidator from "../../validators/user/index.js";
const UserRouter = Router();
UserRouter.put(
  "/update-profile",
  AuthenticationMiddleware,
  UserController.updateProfile
);
UserRouter.put(
  "/update-password",
  AuthenticationMiddleware,
  UserValidator.updatePassword,
  UserController.updatePassword
);
UserRouter.get(
  "/get-users",
  AuthenticationMiddleware,
  UserController.getAllUsers
);
export default UserRouter;
