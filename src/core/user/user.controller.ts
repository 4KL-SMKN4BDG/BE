import BaseController from "../../base/controller.base.ts";
import { NotFound } from "../../exceptions/catch.exception.ts";
import UserService from "./user.service.ts";
import type { Request, Response } from "express";

class UserController extends BaseController {
  #service: UserService;

  constructor() {
    super();
    this.#service = new UserService();
  }

  findAll = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Users successfully retrieved");
  });

  findById = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("User not found");

    return this.ok(res, data, "User successfully retrieved");
  });

  create = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.create(req.body);
    return this.created(res, data, "User successfully created");
  });

  update = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.update(req.params.id, req.body);
    return this.ok(res, data, "User successfully updated");
  });

  delete = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "User successfully deleted");
  });
}

export default UserController;
