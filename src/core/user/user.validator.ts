import Joi from "joi";

export const UserValidator = {
  create: Joi.object({
    // no-data
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    nomorInduk: Joi.string().optional(),
    email: Joi.string().email().optional(),
    password: Joi.string().optional(),
    address: Joi.string().optional(),
  }),
};

export default UserValidator;
