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
    const data = await this.db.company.findMany({ ...q as {[key: string]: never}, include: { users: { omit: { password: true }, include: { roles: true } } } });
    data.map((company: any) => {
      company.logo = company.logo ? `https://localhost:3000/${company.logo}` : null;
      company.teachers = company.users.filter((user: any) => user.roles.code === "TEACHER");
      company.students = company.users.filter((user: any) => user.roles.code === "STUDENT");
      delete company.users;
    })
    if (query.paginate) {
      const countData = await this.db.company.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id: any) => {
    const data: any = await this.db.company.findUnique({ where: { id }, include: { users: { omit: { password: true } } } });
      data.logo = data.logo ? `https://localhost:300/${data.logo}` : null;
      data.teachers = data.users.filter((user: any) => user.roles.code === "TEACHER");
      data.students = data.users.filter((user: any) => user.roles.code === "STUDENT");
      delete data.users;
    return data;
  };

  create = async (payload: any, files: any) => {
    const dataArray = [];
    for(let i = 0; i < payload.name.length; i++) {
      const companyData = {
        name: payload.name[i],
        description: payload.description[i],
        // rencana selanjutnya: untuk https dari google maps gak perlu dimasukan ke database
        address: payload.address[i],
        capacity: payload.capacity[i],
        logo: ''
      };
      if (files && files.logo && files.logo[i]) companyData.logo = files.logo[i].path.replace(/\\/g, '/');
      dataArray.push(companyData);
    };
    
    const data = await this.db.company.createMany({ data: dataArray });
    return data;
  };

  update = async (id: any, payload: Payload, files: any) => {
    if (files && files.logo && files.logo[0]) payload.logo = files.logo[0].path;
    const data = await this.db.company.update({ where: { id }, data: payload });
    // rencana selajutnya: hapus file lama agar tidak menumpuk di server
    return data;
  };

  delete = async (id: any) => {
    const data = await this.db.company.delete({ where: { id } });
    return data;
  };

  apply = async (user: any, companyId: any) => {
    const data = await this.db.user.update({
        where: { id: user.id },
        data: {
          status: "PENDING",
          company: { connect: { id: companyId }}
        }
    });
    return data;
  };

  response = async (user: any, payload: any) => {
    const data = await this.db.user.update({
      where: { id: payload.userId },
      data: {
        status: payload.status
      }
    });
    return data;
  }
}

export default CompanyService;  
