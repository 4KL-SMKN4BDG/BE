import BaseService from "../../base/service.base.ts";
import prisma from '../../config/prisma.db.ts';

interface Payload {
  [key: string]: any;
}

class UserService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query: any) => {
    const q: { [key: string]: any } = this.transformBrowseQuery(query);
    const data = await this.db.user.findMany({ ...q as {[key: string]: never} });

    if (query.paginate) {
      const countData = await this.db.user.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id: any) => {
    const data = await this.db.user.findUnique({ where: { id } });
    return data;
  };

  create = async (payload: any) => {
    const data = await this.db.user.create({ data: payload });
    return data;
  };

  update = async (id: any, payload: Payload) => {
    const data = await this.db.user.update({ where: { id }, data: payload });
    return data;
  };

  delete = async (id: any) => {
    const data = await this.db.user.delete({ where: { id } });
    return data;
  };
}

export default UserService;  
