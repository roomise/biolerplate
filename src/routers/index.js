import { Router } from "express";
import AuthRouter from "./auth/index.js";
import UserRouter from "./user/index.js";

const AllRouters = Router();
AllRouters.use(AuthRouter);
AllRouters.use(UserRouter);
export default AllRouters;
