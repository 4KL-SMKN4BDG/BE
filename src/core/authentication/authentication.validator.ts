import Joi from "joi";

export const AuthenticationValidator = {
  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
  }),
  refresh: Joi.object({
    refreshToken: Joi.string().required()
  }),
  register: Joi.object({
    name: Joi.string().min(3).max(30).required(),
    nomorInduk: Joi.string().required(),
  }),
  advancedRegister: Joi.object({
    name: Joi.string().required(),
    nomorInduk: Joi.string().required(),
  }),
};

export default AuthenticationValidator;
