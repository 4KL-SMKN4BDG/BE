import multer from 'multer';
import fs from 'fs';
import { BadRequest, catchResponse } from '../exceptions/catch.exception.ts';
import type { Request, Response, NextFunction } from 'express';

/**
 * @param {'./uploads' | './public'} basePath
 * @param {string} subPaths
 * @returns {multer.StorageEngine}
 */
const createStorage = (basePath: './uploads' | './public', subPaths: string) => {
    return multer.diskStorage({
        destination: function (req, file, cb) {
            const fullPath = basePath + subPaths;
            if (fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath, { recursive: true});
            }
            cb(null, fullPath);
        },
        filename: function (req, file, cb) {
            const fileName = `${Date.now()}-${file.filename}-${req.user?.id ?? 'null'}- ${file.originalname}`;
            cb(null, fileName);
        },
    });
};

/**
 * @param {'./uploads' | './public'} basePath
 * @param {string} subPaths
 * @param {{
 * name: string,
 * mimeTypes: (
 * 'image/jpeg' |
 * 'image/jpg' |
 * 'image/png' |
 * 'video/mp4' |
 * 'video/webm' |
 * 'application/pdf' |
 * 'application/msword')[]
 * maxCount?: number,
 * limitSize?: number
 * }[]} fields
 */
const uploadMany = (
    basePath: './uploads' | './public' = './public', 
    subPaths: string,
    fields: {
        name: string;
        mimeTypes: (
            'image/jpeg' |
            'image/jpg' |
            'image/png' |
            'video/mp4' |
            'video/webm' |
            'application/pdf' |
            'application/msword'
        )[],
        maxCount?: number;
        limitSize?: number;
    }[]
) => (req: Request, res: Response, next: NextFunction) => {
    const upload = multer({
        storage: createStorage(basePath, subPaths),
    }).fields(fields.map(({ name, maxCount }) => ({ name, maxCount })));

    upload(req, res, (err: any) => {
        if (err) return next(new BadRequest(err.message ?? 'Failed to upload.'));

        for (const field of fields) {
            const files = (req.files && typeof req.files === 'object' && !Array.isArray(req.files)) ? req.files[field.name] : undefined;
            if (files) {
                for (const file of files) {
                    if (file.size > (field.limitSize ?? 3000000)) {
                        return next(
                            new BadRequest(`${field.name}'s size to large.`)
                        );
                    };

                    if (!field.mimeTypes.includes(file.mimetype as any)) {
                        return next(
                            new BadRequest(`${field.name}'s format`)
                        )
                    }
                }
            }
        }

        next();
    });
};

export { uploadMany };
