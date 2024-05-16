import Joi from "joi";
import { BAD_REQUEST } from "../../utils/statusCodes.js";
const UserValidator = {
  updatePassword: (req, res, next) => {
    const schema = Joi.object({
      old_password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      new_password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
    });
    const response = schema.validate(req.body);
    if (response.error) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Bad Data", error: response.error });
    }
    next();
  },
};
export default UserValidator;
