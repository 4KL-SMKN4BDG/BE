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
    const user: User | null = await this.db.user.findUnique({ where: { email: payload.email }});
    if (!user) throw new NotFound('Email not registered');
    if (!await compare(payload.password, user?.password)) throw new BadRequest('Invalid password');

    const accessToken = await generateAccessToken(user);
    const refreshToken = await generateRefreshToken(user);

    return { user: this.exclude(user, ['password']), token: { accessToken, refreshToken }};
  };

  refresh = async (refreshToken: string) => {
    const decoded: any = jwt.decode(refreshToken);

    const user = await this.db.user.findUnique({ where: { email: decoded.email }});
    if (!user) throw new NotFound('Email not registered');

    const accessToken = await generateAccessToken(user);
    const newrefreshToken = await generateRefreshToken(user);

    return { user: this.exclude(user, ['password']), token: { accessToken, refreshToken: newrefreshToken }};
  }

  register = async (payload: any) => {
    if (await this.db.user.findUnique({ where: { email: payload.email }})) throw new BadRequest('Email already in use');
    payload.password = await hashPassword(payload.password);
    const user = await this.db.role.findUnique({ where: { code: 'USER' }});
    const data = await this.db.user.create({ data: payload, roles: { connect: { id: user?.id } } as never });

    return this.exclude(data, ['password']);
  }
}

export default AuthenticationService;  
