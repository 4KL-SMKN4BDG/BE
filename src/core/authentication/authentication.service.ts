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

  resetPassword = async (newPassword: any, nomorInduk: any) => {
    const user = await this.db.user.update({ 
      where: { nomorInduk: nomorInduk },
      data: { password: await hashPassword(newPassword)}
    });
    return this.exclude(user, ['password']);
  };

  refresh = async (refreshToken: string) => {
    const decoded: any = jwt.decode(refreshToken);

    const user = await this.db.user.findUnique({ where: { nomorInduk: decoded.nomorInduk }});
    if (!user) throw new NotFound('Nomor Induk not registered');

    const accessToken = await generateAccessToken(user);
    const newrefreshToken = await generateRefreshToken(user);

    return { user: this.exclude(user, ['password']), token: { accessToken, refreshToken: newrefreshToken }};
  };
};

export default AuthenticationService;  
