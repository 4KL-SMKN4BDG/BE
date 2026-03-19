import Joi from "joi";

export const AuthenticationValidator = {
  login: Joi.object({
    nomorInduk: Joi.string().required(),
    password: Joi.string().min(6).required()
  }),
  resetPassword: Joi.object({
    newPassword: Joi.string().min(6).required(),
    resetToken: Joi.string().required()
  }),
  refresh: Joi.object({
    refreshToken: Joi.string().required()
  }),
  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  })
};

export default AuthenticationValidator;
