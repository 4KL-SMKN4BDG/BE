import Joi from "joi";

export const UserValidator = {
  create: Joi.object({
    role: Joi.string().required(),
    newUsers: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        nomorInduk: Joi.string().required(),
    }))
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    nomorInduk: Joi.string().optional(),
    class: Joi.string().optional(),
    major: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    address: Joi.string().optional(),
  }),
};

export default UserValidator;
