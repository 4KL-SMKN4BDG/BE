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
    const data = await this.db.company.findMany({ ...q as {[key: string]: never}, include: { users: { omit: { password: true } } } });
// rencana selanjutnya: tambahkan relasi users dengan omit password, dan memisahkan antara teacher dengan student
// rencana selanjutnya: tambahkan base url untuk akses logo company
    if (query.paginate) {
      const countData = await this.db.company.count({ where: q.where });
      return this.paginate(data, countData, q);
    }
    return data;
  };

  findById = async (id: any) => {
    const data = await this.db.company.findUnique({ where: { id }, include: { users: { omit: { password: true } } } });
    // rencana selanjutnya: tambahkan relasi users dengan omit password, dan memisahkan antara teacher dengan student
// rencana selanjutnya: tambahkan base url untuk akses logo company
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
      if (files && files.logo && files.logo[i]) companyData.logo = files.logo[i].path;
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
}

export default CompanyService;  
