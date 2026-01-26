import fs from 'fs';
import { isBoolean, isDateAble, isInteger } from '../utils/type.ts';
import { PrismaClient } from '../../generated/prisma/client.ts';
import moment from 'moment';

export interface BrowseQuery {
  where?: string;
  starts?: string;
  search?: string;
  in_?: string;
  not_?: string;
  isnull?: string;
  gtr?: string;
  lte?: string;
  order?: string;
  paginate?: boolean;
  limit?: number;
  page?: number;

  [key: string]: any;
}

class BaseService {
  db: PrismaClient;
  /**
   * @param {PrismaClient} db
   */
  constructor(db: PrismaClient) {
    this.db = db;
  }

  /**
   * @param {{}} query array of data
   */
  transformBrowseQuery = (query: BrowseQuery = {}) => {
    // where
    let wheres: Record<string, any> = {};
    if (query && query.where) {
      query.where.split('|').forEach((q) => {
        let [col = '', val = ''] = q.split(':');

        if (val == '') return;

        let parsedVal: string | number | boolean = val;

        if (isInteger(val)) parsedVal = parseInt(val);
        else if (isBoolean(val)) parsedVal = val === 'true';
        

        const keys = col.split('.');
        let current = wheres;

        
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            current[key] = parsedVal;
          } else {
            current[key] = current[key] || {};
            current = current[key];
          }
        });
      });
    }
    
    // starts
    let starts: Record<string, any> = {};
    if (query && query.starts) {
      const ors: any[] = [];
      query.starts.split('|').forEach((q) => {
        const [col = '', val = ''] = q.split(':');
        const keys = col.split('.');
        let current: any = {},
          temp = current;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            temp[key] = {
              startsWith: val,
            };
          } else {
            temp[key] = {};
            temp = temp[key];
          }
        });

        ors.push(current);
      });

      starts['OR'] = ors;
    }

    // search
    let search: Record<string, any> = {};
    if (query && query.search) {
      const ors: any[] = [];
      query.search.split('|').forEach((q) => {
        const [col = '', val = ''] = q.split(':');
        const keys = col.split('.');
        let current: any = {},
          temp = current;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            temp[key] = {
              contains: val,
              // mode: "insensitive",
            };
          } else {
            temp[key] = {};
            temp = temp[key];
          }
        });

        ors.push(current);
      });

      search['OR'] = ors;
    }

    // in
    let in_: Record<string, any> = {};
    if (query && query.in_) {
      query.in_.split('|').forEach((q) => {
        let [col = '', val = ''] = q.split(':');

        const keys = col.split('.');
        let current: any = in_;
        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            let parsedVal: string | number | boolean = val;
            const vals = val.split(',').map((v) => {
              if (isInteger(v)) {
                parsedVal = parseInt(v);
              } else if (isBoolean(v)) {
                parsedVal = v === 'true';
              }
              return parsedVal;
            });
            if (keys[keys.length - 2]?.endsWith('s')) {
              current['some'] = {
                [key]: {
                  in: vals,
                },
              };
            } else {
              current[key] = {
                in: vals,
              };
            }
          } else {
            current[key] = current[key] || {};
            current = current[key];
          }
        });
      });
    }

    // is not
    let not_: Record<string, any> = {};
    if (query && query.not_) {
      const ors: any[] = [];
      query.not_.split('|').forEach((q) => {
        const [col = '', val = ''] = q.split(':');
        const keys = col.split('.');
        let current: any = {},
          temp = current;

        keys.forEach((key, index) => {
          if (index === keys.length - 1) {
            temp[key] = {
              not: val,
            };
          } else {
            temp[key] = {};
            temp = temp[key];
          }
        });

        ors.push(current);
      });

      not_['OR'] = ors;
    }

    // is null
    let isnull: Record<string, any> = {};
    if (query && query.isnull) {
      query.isnull.split('|').forEach((q) => {
        isnull[q] = null;
      });
    }

    // gte
    let gte: Record<string, any> = {};
    if (query && query.gte) {
      query.gte.split('|').forEach((q: string) => {
        const [col = '', val = ''] = q.split(':');
        gte[col] = {
          gte: isDateAble(val) ? moment(val).toDate() : val,
        };
      });
    }

    // lte
    let lte: Record<string, any> = {};
    if (query && query.lte) {
      query.lte.split('|').forEach((q) => {
        const [col = '', val = ''] = q.split(':');
        lte[col] = {
          lte: isDateAble(val) ? moment(val).endOf('day').toDate() : val,
        };
      });
    }

    // order by
    let orderBy: Record<string, any> = {};
    if (query && query.order) {
      query.order.split('|').forEach((q) => {
        const [col = '', val = ''] = q.split(':');
        orderBy[col] = val;
      });
    }

    // pagination
    let pagination: Record<string, any> = {};

    if (query && query.limit && query.limit > 0) {
      if (query.paginate) pagination['take'] = query.limit;
    }

    if (query && query.paginate) {
      if (pagination['take'] && pagination['take'] > 0) {
        const page = query.page && query.page > 0 ? query.page : 1;
        pagination['skip'] = (page - 1) * (pagination['take'] || 0);
      }
    }

    return {
      where: {
        AND: [wheres, search, starts, in_, not_, isnull, gte, lte],
      },
      take: pagination['take'],
      skip: pagination['skip'],
      orderBy: orderBy,
    };
  };

  /**
   * @param {any[]} data array of data
   * @param {number} count number amount of data
   * @param {any} query prisma query args
   */
  paginate = (data: any[], count: number, query: any) => {
    const size = query.take <= 0 ? count : query.take;

    return {
      total_items: count,
      page: Math.floor(query.skip / query.take) + 1 || 1,
      limit: size,
      total_pages: Math.ceil(count / size) || 1,
      items: data,
    };
  };

  /**
   * @param {{}} data
   * @param {string[]} selects
   */
  exclude = (data: Record<string, any>, selects: string[]) => {
    return Object.fromEntries(
      Object.entries(data).filter(([key]) => !selects.includes(key))
    );
  };

  /**
   * @param {string[]} selects
   */
  select = (selects: string[] = []) => {
    if (!selects.length) return undefined;

    const select: any = {};

    selects.forEach((key) => {
      const parts = key.split('.');
      let current = select;

      parts.forEach((part, index) => {
        if (!current[part]) {
          if (index === parts.length - 1) {
            current[part] = true;
          } else {
            current[part] = {};
            current[part].select = {};
          }
        } else if (
          index === parts.length - 1 &&
          typeof current[part] === 'object' &&
          !current[part].select
        ) {
          current[part].select = {};
        }
        current = current[part].select;
      });
    });

    return select;
  };

  deleteUpload = (path: string) => {
    fs.unlink(path, (err) => {
      if (err) {
        console.error('ERR(file): ', err);
      }
    });
  };

  getQueryValue = (query: Record<string, any> = {}, key: string, col: string) => {
    if (query.hasOwnProperty(key)) {
      const colvals = query[key].split('+');
      const findMatchCol = colvals.find((cv: string) => cv.includes(col));
      if (findMatchCol) {
        let val = findMatchCol.split(':')[1];

        if (isDateAble(val)) val = moment(val).toDate();

        return val;
      }
    }
  };
}

export default BaseService;
