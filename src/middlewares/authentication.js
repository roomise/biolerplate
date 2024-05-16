import Jwt from "jsonwebtoken";
import "dotenv/config";
import { INVALID_CREDENTIALS } from "../utils/statusCodes.js";
const AuthenticationMiddleware = (req, res, next) => {
  const header = req.headers;
  let token = header.authorization.split(" ");
  token = token[1];
  console.log(token);
  if (!token) {
    return res
      .status(INVALID_CREDENTIALS)
      .json({ message: "Unauthorized: Token not provided" });
  }
  try {
    const userData = Jwt.verify(token, process.env.AUTH_TOKEN_SECRET);
    req.user = userData;
  } catch (error) {
    console.log(error, "error");

    return res
      .status(INVALID_CREDENTIALS)
      .json({ message: "Invalid token - please login again" });
  }
  next();
};
export default AuthenticationMiddleware;
