import BaseService from "../../base/service.base.ts";
import prisma from '../../config/prisma.db.ts';
import { hashPassword } from "../../helpers/bcrypt.helper.ts";
import { NotFound } from "../../exceptions/catch.exception.ts";

interface Payload {
  [key: string]: any;
}

class UserService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query: any) => {
    const q: { [key: string]: any } = this.transformBrowseQuery(query);
    const data = await this.db.user.findMany({ ...q as {[key: string]: never}, include: { roles: true, company: true }, omit: { password: true } });

    if (query.paginate) {
      const countData = await this.db.user.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id: any) => {
    const data = await this.db.user.findUnique({ where: { id }, include: { roles: true, company: true}, omit: { password: true } });
    return data;
  };

  create = async (payload: any) => {
    const role = await this.db.role.findUnique({
      where: { code: payload.role}
    });
    if (!role) throw new NotFound('Role not found');

    const newUsers = payload.newUsers;

    const data = [];
    for (let i = 0; i < newUsers.length; i++) {
      const user = await this.db.user.create({
        data: {
          name: newUsers[i].name,
          nomorInduk: newUsers[i].nomorInduk,
          password: await hashPassword(newUsers[i].nomorInduk),
          roles: { connect: { id: role.id }} 
        }
      });
      data.push(this.exclude(user, ['password']));
    };

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
