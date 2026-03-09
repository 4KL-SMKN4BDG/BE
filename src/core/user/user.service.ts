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
    data.map((user: any) => {
      user.profilePhoto = user.profilePhoto ? `https://localhost:3000/${user.profilePhoto}` : null;
    })

    if (query.paginate) {
      const countData = await this.db.user.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id: any) => {
    const data = await this.db.user.findUnique({ where: { id }, include: { roles: true, company: true}, omit: { password: true } });
    if (data) data.profilePhoto = data.profilePhoto ? `https://localhost:3000/${data.profilePhoto}` : null;
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

  update = async (id: any, payload: Payload, files: any) => {
    const oldPhoto = await this.db.user.findUnique({ where: { id }, select: { profilePhoto: true } });
    if (files && files.profilePhoto && files.profilePhoto[0]) payload.profilePhoto = files.profilePhoto[0].path.replace(/\\/g, '/');
    const data = await this.db.user.update({ where: { id }, data: payload });
    if (payload.profilePhoto && oldPhoto && oldPhoto.profilePhoto) this.deleteUpload(oldPhoto.profilePhoto);
    return data;
  };

  delete = async (id: any) => {
    const data = await this.db.user.delete({ where: { id } });
    return data;
  };
}

export default UserService;  
