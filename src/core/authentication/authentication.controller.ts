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

  resetPassword = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.resetPassword(req.body.newPassword, req.body.resetToken);
    return this.ok(res, data, "Reset password successful");
  });

  forgotPassword = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.forgotPassword(req.body.email);
    return this.ok(res, data, `Email sent to ${data.email} for password reset`);
  });

  refresh = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.refresh(req.body.refreshToken);
    return this.created(res, data, "Refresh token successful");
  });
}

export default AuthenticationController;
