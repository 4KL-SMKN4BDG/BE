import BaseService from "../../base/service.base.ts";
import prisma from '../../config/prisma.db.ts';
import { Forbidden } from "../../exceptions/catch.exception.ts";
import { convertGmapsUrl } from "../../helpers/convertGmapsURL.helper.ts";

interface Payload {
  [key: string]: any;
}

class CompanyService extends BaseService {
  constructor() {
    super(prisma);
  }

  findAll = async (query: any) => {
    const q: { [key: string]: any } = this.transformBrowseQuery(query);
    const data = await this.db.company.findMany({ ...q as {[key: string]: never},
      //  include: { users: { omit: { password: true }, include: { roles: true } } } 
      });
    data.map((company: any) => {
      company.logo = company.logo ? `${process.env.BE_BASE_URL}/api/download?path=${company.logo}` : null;
      // company.teachers = company.users.filter((user: any) => user.roles[0].code === "TEACHER");
      // company.students = company.users.filter((user: any) => user.roles[0].code === "STUDENT");
      // delete company.users;
    });
    if (query.paginate) {
      const countData = await this.db.company.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id: any) => {
    const data: any = await this.db.company.findUnique({ where: { id }, include: { users: { include: { roles: true },omit: { password: true } } } });
      data.logo = data.logo ? `${process.env.BE_BASE_URL}/api/download?path=${data.logo}` : null;
      data.teachers = data.users.filter((user: any) => user.roles[0].code === "TEACHER");
      data.students = data.users.filter((user: any) => user.roles[0].code === "STUDENT");
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
        maps: payload.maps[i],
        capacity: payload.capacity[i],
        logo: ''
      };
      if (companyData.maps) companyData.maps = await convertGmapsUrl(companyData.maps)
      if (files && files.logo && files.logo[i]) companyData.logo = files.logo[i].path.replace(/\\/g, '/');
      dataArray.push(companyData);
    };
    
    const data = await this.db.company.createMany({ data: dataArray });
    return data;
  };

    update = async (id: any, payload: Payload, files: any) => {
    const oldLogo = await this.db.company.findUnique({ where: { id }, select: { logo: true } });
    if (files && files.logo && files.logo[0]) payload.logo = files.logo[0].path.replace(/\\/g, '/');
    if (payload.maps) payload.maps = await convertGmapsUrl(payload.maps);
    const data = await this.db.company.update({ where: { id }, data: payload });
    if (payload.logo && oldLogo && oldLogo.logo) this.deleteUpload(oldLogo.logo);
    return data;
  };

  delete = async (id: any) => {
    const data = await this.db.company.delete({ where: { id } });
    return data;
  };

  apply = async (user: any, companyId: any) => {
    console.log(user);
    if (user.companyId) throw new Forbidden('User already has a company');
    if (user.roles[0].code === "TEACHER" || user.roles[0].code === "ADMIN") throw new Forbidden('Only student can apply to a company');
    const data = await this.db.user.update({
        where: { id: user.id },
        data: {
          status: "PENDING",
          company: { connect: { id: companyId }}
        }
    });
    return data;
  };

  response = async (payload: any) => {
    const data = await this.db.user.findUnique({ where: { id: payload.userId }, include: { company: true } });
    if (payload.status === "REJECTED") payload.disconnect = true
    await this.db.user.update({
      where: { id: payload.userId },
      data: {
        status: payload.status,
        company: { disconnect: payload.disconnect }
      }
    });
    const html = applicationResponseEmailTemplate(data?.name || "Siswa SMKN 4 Bandung", data?.company?.name || "Tempat PKL anda", payload.status);
    await sendEmail(data?.email || '', "Hasil Pengajuan PKL", html);
    return data;
  };

  addMentor = async (payload: any) => {
    const data = await this.db.user.update({
      where: { id: payload.teacherId },
      data: {
        company: { connect: { id: payload.companyId }}
      }
    })
  };
}

export default CompanyService;  
