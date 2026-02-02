import BaseService from "../../base/service.base.ts";
import prisma from '../../config/prisma.db.ts';

interface Payload {
  [key: string]: any;
}

class CompanyService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query: any) => {
    const q: { [key: string]: any } = this.transformBrowseQuery(query);
    const data = await this.db.company.findMany({ ...q as {[key: string]: never} });

    if (query.paginate) {
      const countData = await this.db.company.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id: any) => {
    const data = await this.db.company.findUnique({ where: { id } });
    return data;
  };

  create = async (payload: any) => {
    const data = await this.db.company.create({ data: payload });
    return data;
  };

  update = async (id: any, payload: Payload) => {
    const data = await this.db.company.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id: any) => {
    const data = await this.db.company.delete({ where: { id } });
    return data;
  };
}

export default CompanyService;  
