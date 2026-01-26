import httpStatus from 'http-status-codes';
import {
  ValidationError,
  UnauthorizedError,
  ApiError,
} from './errors.exception.ts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import fs from 'fs';
import type { NextFunction, Request, Response } from 'express';

const APP_DEBUG = process.env.APP_DEBUG;

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // Hapus file yang diupload (jika ada) untuk efisiensi penyimpanan
  if (err) {
    const uploaded: Express.Request["files"] = [];

    if (req.file) uploaded.push(req.file);
    if (req.files) {
      if (typeof req.files === 'object')
        Object.keys(req.files).forEach((field) => {
          req.files[field].forEach((file: any) => {
            uploaded.push(file);
          });
        });
      else if (Array.isArray(req.files))
        req.files.forEach((file) => uploaded.push(file));
    }

    if (uploaded.length)
      uploaded.forEach((up: Express.Request["files"]) => {
        fs.unlink(up.path, (unlinkErr) => {
          if (unlinkErr) {
            console.error('ERR(file): ', unlinkErr);
          }
        });
      });
  }

  if (res.headersSent) {
    return next(err);
  }

  // Contoh penanganan error spesifik dengan status code yang tepat

  if (err instanceof ValidationError) {
    return res.status(httpStatus.StatusCodes.BAD_REQUEST).json({
      errors: {
        status: httpStatus.StatusCodes.BAD_REQUEST,
        data: null,
        error: {
          code: err.name,
          message: err.validationMessage,
        },
      },
    });
  }

  if (err instanceof PrismaClientKnownRequestError) {
    // Misal kita gunakan status BAD_REQUEST untuk error validasi Prisma
    return res.status(httpStatus.StatusCodes.BAD_REQUEST).json({
      errors: {
        status: httpStatus.StatusCodes.BAD_REQUEST,
        data: null,
        error: {
          code: err.name,
          message: err?.meta?.target || err.message,
        },
      },
    });
  }

  if (err instanceof ApiError) {
    return res.status(err.statusCode || httpStatus.StatusCodes.INTERNAL_SERVER_ERROR).json({
      errors: {
        status: err.statusCode,
        data: null,
        error: {
          code: err.name,
          message: err.message,
        },
      },
    });
  }

  // Default: gunakan statusCode yang tersedia atau INTERNAL_SERVER_ERROR
  const statusCode =
    err.http_code ||
    err.statusCode ||
    httpStatus.StatusCodes.INTERNAL_SERVER_ERROR ||
    500;
  res.status(statusCode);
  return res.json({
    errors: {
      status: statusCode,
      data: null,
      error: {
        code: err.name,
        message: err.message,
        trace:
          APP_DEBUG && statusCode !== httpStatus.StatusCodes.NOT_FOUND
            ? err.stack.split('\n')
            : undefined,
      },
    },
  });
};

export default errorHandler;
