import Joi from 'joi';
import type { CustomHelpers, ErrorReport, LanguageMessages } from 'joi';
import prisma from '../config/prisma.db.ts'

const containColon = (value: string, helpers: CustomHelpers) => {
  let errMsg = null;
  value.split('+').some((el) => {
    if (!el.includes(':')) {
      errMsg = 'Query must contain ":" to separate field and value';
      return true;
    }
  });

  return errMsg ? helpers.message(errMsg) : value;
};

const orderPattern = (value: string, helpers: CustomHelpers) => {
  let errMsg = null;
  value.split('+').forEach((el) => {
    if (!el.includes(':')) {
      errMsg = 'Query must contain ":" to separate field and value';
      return true;
    }
    const val = el.split(':')[1];
    if (val != 'desc' && val != 'asc') {
      errMsg = 'Order query value must be "desc" or "asc"';
      return true;
    }
  });

  return errMsg ? helpers.message(errMsg) : value;
};

export const isTimeString = (value: string, helpers: CustomHelpers) => {
  const pattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
  if (!pattern.test(value))
    return helpers.message('Time string must be in the format HH:mm:ss' as any);
  return value;
};

/**
 * @param {string} table table name
 */
export const relationExist = (table: keyof typeof prisma) => {
  return async (value: any, helpers: CustomHelpers) => {
    if (value == undefined) return value;

    try {
      const found = await (prisma as any)[table].count({ where: { id: value } });
      if (found == 0) {
        const fieldName = helpers.state.path?.join('.');
        return helpers.message(
          `The ${fieldName} with ID ${value} does not exist` as any
        );
      }

      return value;
    } catch (err: any) {
      return helpers.message(err.message);
    }
  };
};

export const baseValidator = {
  browseQuery: Joi.object({
    search: Joi.string().optional().custom(containColon),
    starts: Joi.string().optional().custom(containColon),
    where: Joi.string().optional().custom(containColon),
    in_: Joi.string().optional().custom(containColon),
    not_: Joi.string().optional().custom(containColon),
    isnull: Joi.string().optional(),
    gte: Joi.string().optional().custom(containColon),
    lte: Joi.string().optional().custom(containColon),
    paginate: Joi.boolean().optional().default(true),
    limit: Joi.number().optional().default(10),
    page: Joi.number().optional().default(1),
    order: Joi.string().optional().custom(orderPattern),
  }),
};
