import BaseController from "../../base/controller.base.ts";
import { NotFound } from "../../exceptions/catch.exception.ts";
import AuthenticationService from "./authentication.service.ts";
import type { Request, Response } from "express";

class AuthenticationController extends BaseController {
  #service: AuthenticationService;

  constructor() {
    super();
    this.#service = new AuthenticationService();
  }

  login = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.login(req.body);
    return this.ok(res, data, "Login successful");
  });

  refresh = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.refresh(req.body.refreshToken);
    return this.created(res, data, "Refresh token successful");
  });

  register = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.register(req.body);
    return this.ok(res, data, "Register successful");
  });
}

export default AuthenticationController;
