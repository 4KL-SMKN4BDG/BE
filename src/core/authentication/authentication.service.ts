import BaseService from "../../base/service.base.ts";
import prisma from "../../config/prisma.db.ts";
import { hashPassword, compare } from "../../helpers/bcrypt.helper.ts";
import { BadRequest, NotFound } from "../../exceptions/catch.exception.ts";
import { generateAccessToken, generateRefreshToken } from "../../helpers/jwt.helper.ts";
import jwt from "jsonwebtoken";
import type { User } from "../../../generated/prisma/client.ts";

interface Payload {
  [key: string]: any;
}

class AuthenticationService extends BaseService {
  constructor() {
    super(prisma);
  }
  login = async (payload: any) => {
    const user = await this.db.user.findUnique({ where: { nomorInduk: payload.nomorInduk }});
    if (!user) throw new NotFound('NIS not registered');
    if (!await compare(payload.password, user?.password)) throw new BadRequest('Invalid password');

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { user: this.exclude(user, ['password']), token: { accessToken, refreshToken }};
  };

  resetPassword = async (payload: any) => {
    const user = await this.db.user.update({ 
      where: { nomorInduk: payload.nomorInduk },
      data: { password: await hashPassword(payload.newPassword)}
    });
    return this.exclude(user, ['password']);
  };

  refresh = async (refreshToken: string) => {
    const decoded: any = jwt.decode(refreshToken);

    const user = await this.db.user.findUnique({ where: { email: decoded.email }});
    if (!user) throw new NotFound('Email not registered');

    const accessToken = await generateAccessToken(user);
    const newrefreshToken = await generateRefreshToken(user);

    return { user: this.exclude(user, ['password']), token: { accessToken, refreshToken: newrefreshToken }};
  };

  register = async (payload: any) => {
    const data = await this.db.user.create({
      data: {
        name: payload.name,
        nomorInduk: payload.nomorInduk,
        password: await hashPassword(payload.nomorInduk)
      }
    });

    return this.exclude(data, ['password']);
  };

  advancedRegister = async (payload: any) => {
    //convert dulu text nama dan nis nya
    const arrayName = payload.name.split("\n");
    const arrayNomorInduk = payload.nomorInduk.split("\n");
    let finalArrayJSON = [];
    for (let i = 0; i < arrayName.length; i++) {
      const json = {
        name: arrayName[i],
        nomorInduk: arrayNomorInduk[i],
        password: await hashPassword(arrayNomorInduk[i])
      }
      finalArrayJSON.push(json);
    };
    
    const newStudent = await this.db.user.createMany({
      data: finalArrayJSON
    });

    return newStudent
  }
}

export default AuthenticationService;  
