import { catchResponse } from '../exceptions/catch.exception.ts';
import type { Request, Response, NextFunction } from 'express';
import type Joi from 'joi';

interface ValidatorSchemas {
    body?: Joi.ObjectSchema<any>;
    query?: Joi.ObjectSchema<any>;
}

/**
 * @param {{body?: any, query?: any}} schemas
 */

const validatorMiddleware = ({ body, query }: ValidatorSchemas) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const options = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };

        try {
            const bodyValue = body ? await body.validateAsync(req.body, options) : req.body;

            const queryValue = query ? await query.validateAsync(req.query, options) : req.query;

            req.body = bodyValue;
            res.locals.query = queryValue;
            next();
        } catch (err) {
            return catchResponse(err, req, res, next);
        }
    };
};

export default validatorMiddleware;