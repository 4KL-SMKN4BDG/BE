import httpStatus from 'http-status-codes';
import { ApiError } from '../exceptions/errors.exception.ts';
import { verifyToken } from '../helpers/jwt.helper.ts';
import { Unauthenticated } from '../exceptions/catch.exception.ts';
import prisma from '../config/prisma.db.ts';
import type { Request, Response, NextFunction } from 'express';

export default function auth(roles?: string[]) {
    return async (req: Request, res: Response, next: NextFunction) => {
        // rencana selanjutnya: benerin return dari error handler dari no access token dan expired token
        try {
            const authHeader = req.headers.authorization;
            if (!authHeader) {
                return next(new ApiError(
                    httpStatus.UNAUTHORIZED, 
                    'NO_AUTHORIZATION', 
                    'Please Authenticate'
                )
              );
            }

            const parts = authHeader.split(' ');
            const token = parts[1];
            if (!token) {
                return next(new ApiError(
                    httpStatus.UNAUTHORIZED,
                    'NO_TOKEN',
                    'please Authenticate'
                )
              );
            }

            let decoded: any;
            try {
                decoded = verifyToken(token);
            } catch (e) {
                return next(new Unauthenticated('Invalid or expired token'));
            }

            const user = await prisma.user.findFirst({
                where: { id: decoded.userId },
                include: { roles: true },
            });

            if (!user) {
                return next(new ApiError(
                    httpStatus.UNAUTHORIZED,
                    'USER_NOT_FOUND',
                    'please Authenticate'
                )
              );
            }

            if (roles && roles.length > 0) {
                const userRoleCodes = user.roles.map(role => role.code);
                const hasAccess = roles.some(allowedRole => userRoleCodes.includes(allowedRole));
                if (!hasAccess) {
                    return next(new ApiError(
                        httpStatus.FORBIDDEN,
                        'NO_ACCESS',
                        'Unauthorized'
                    )
                  );
                }
            }

            req.user = user;
            next();
        } catch (e: any) {
            if (e.message === 'jwt expired') {
                return next(
                    new ApiError(
                        httpStatus.UNAUTHORIZED,
                        'TOKEN_EXPIRED',
                        'Your session has expired, please login again'
                )
              );
            }
        }
    }
}