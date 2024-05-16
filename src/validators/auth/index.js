import Joi from "joi";
import { BAD_REQUEST } from "../../utils/statusCodes.js";

const AuthValidator = {
  register: (req, res, next) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
        .required(),
      // confirm_password: Joi.ref("password"),
      role: Joi.string().min(5).max(5).required(),
      phone: Joi.string().min(11).max(15).required(),
      city: Joi.string().min(3).max(100).required(),
      joining_date: Joi.date(),
      is_active: Joi.boolean().required(),
    });
    const response = schema.validate(req.body);
    if (response.error) {
      return res
        .status(BAD_REQUEST)
        .json({ message: "Bad Data", error: response.error });
    }
    next();
  },
  login: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      password: Joi.string()
        .pattern(new RegExp("^[a-zA-Z0-9]{8,30}$"))
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
  sendOtp: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
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
  verifyOtp: (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string()
        .email({
          minDomainSegments: 2,
          tlds: { allow: ["com", "net"] },
        })
        .required(),
      otp: Joi.required(),
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
export default AuthValidator;
