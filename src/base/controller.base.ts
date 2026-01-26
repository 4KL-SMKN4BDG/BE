import httpStatus from 'http-status';
import fs from 'fs';
import errorHandler from '../exceptions/handler.exception.ts';
import type { Request, Response, NextFunction } from 'express';
import { BadRequest } from '../exceptions/catch.exception.ts';

class BaseController {
  constructor() {}

  ok = (res: Response, data: any = null, message = '') => {
    return res.status(httpStatus.OK).json({
      status: true,
      message: message || 'Success',
      data,
    });
  };

  created = (res: Response, data: any = null, message = '') => {
    return res.status(httpStatus.CREATED).json({
      status: true,
      message: message || 'New data successfully created',
      data,
    });
  };

  noContent = (res: Response, message = '') => {
    return res.status(httpStatus.NO_CONTENT).json({
      status: true,
      message: message || 'Data successfully deleted',
    });
  };

  BadRequest = (res: Response, message = '') => {
    return res.status(httpStatus.BAD_REQUEST).json({
      status: false,
      message: message || 'Bad Request',
    });
  };

  /**
   * @param {Record<string, any>} files
   * @param {string[]} keys
   */

  checkFilesObj = (files: Record<string, any>, keys: string[]) => {
    let message: string | null = null;

    for (const key of keys) {
      if (!Object.prototype.hasOwnProperty.call(files, key)) {
        let name = key;
        if (key.includes('_')) {
          name = key.substring(key.indexOf('_') + 1);
        }
        message = 'Please include ' + name;
        break;
      }
    }

    if (message) throw new BadRequest(message);
  };

  wrapper(method: Function) {
    return async (req: Request, res: Response, ...args: any[]) => {
      try {
        return await method.apply(this, [req, res, ...args]);
      } catch (err) {
        return errorHandler(err, req, res, args[2] as NextFunction);
      }
    };
  }
  

  joinBrowseQuery = (query: Record<string, any>, field: string, colval: string) => {
    query[field] = query[field] ? `${query[field]}+${colval}` : colval;
    return query;
  };

  /**
   * @param {any} data
   * @param {string[]} selects
   * @param {boolean} isPaginate
   */
  exclude = (data: any, selects: string[], isPaginate = false) => {
    if (isPaginate) {
      data['items'] = data['items'].map((dat: any) =>
        Object.fromEntries(
          Object.entries(dat).filter(([key]) => !selects.includes(key))
        )
      );
      return data;
    }

    return Array.isArray(data)
      ? data.map((d) =>
          Object.fromEntries(
            Object.entries(d).filter(([key]) => !selects.includes(key))
          )
        )
      : Object.fromEntries(
          Object.entries(data).filter(([key]) => !selects.includes(key))
        );
  };

  isAdmin = (req: Request) => req.user ? ['ADMIN'].includes(req.user.role.code) : false;

  isFilePathExist = (path: string): boolean => { return !!path && fs.existsSync(path); }

  deleteFileByPath = (path: string) => {
    if (this.isFilePathExist(path))
      fs.unlink(path, (err) => {
        if (err) {
          console.error('ERR(file): ', err);
        }
      });
  };

  /**
   * @param {any} data
   * @param {string[]} selects
   * @param {boolean} isPaginate
   */
  include = (data: any, selects: string[] = [], isPaginate = false) => {
    if (isPaginate) {
      data['items'] = data['items'].map((dat: any) =>
        Object.fromEntries(
          Object.entries(dat).filter(([key]) => selects.includes(key))
        )
      );
      return data;
    }

    return Array.isArray(data)
      ? data.map((d) =>
          Object.fromEntries(
            Object.entries(d).filter(([key]) => selects.includes(key))
          )
        )
      : Object.fromEntries(
          Object.entries(data).filter(([key]) => selects.includes(key))
        );
  };
}

export default BaseController;
