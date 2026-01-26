import * as express from 'express';
import { user } from '../../../generated/prisma/client.ts';

declare global {
    namespace Express {
        export interface Request {
            file?: Express.Multer.File;
            files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] } | any;
            user?: user;
        }
    }
}