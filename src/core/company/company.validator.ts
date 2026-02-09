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
  apply: Joi.object({
    companyId: Joi.string().required()
  }),
  response: Joi.object({
    userId: Joi.string().required(),
    status: Joi.string().required()
  }),
  mentor: Joi.object({
    teacherId: Joi.string().required(),
    companyId: Joi.string().required()
  })
};

export default CompanyValidator;
