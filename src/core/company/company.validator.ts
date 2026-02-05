import Joi from "joi";

export const CompanyValidator = {
  create: Joi.object({
    name: Joi.array().items(Joi.string()).required(),
    description: Joi.array().items(Joi.string()).required(),
    address: Joi.array().items(Joi.string()).required(),
    capacity: Joi.array().items(Joi.number()).required()
  }),
  update: Joi.object({
    name: Joi.string().optional(),
    description: Joi.string().optional(),
    address: Joi.string().optional(),
    capacity: Joi.number().optional()
  }),
};

export default CompanyValidator;
