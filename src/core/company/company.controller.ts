import BaseController from "../../base/controller.base.ts";
import { NotFound } from "../../exceptions/catch.exception.ts";
import CompanyService from "./company.service.ts";
import type { Request, Response } from "express";

class CompanyController extends BaseController {
  #service: CompanyService;

  constructor() {
    super();
    this.#service = new CompanyService();
  }

  findAll = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.findAll(req.query);
    return this.ok(res, data, "Companys successfully retrieved");
  });

  findById = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.findById(req.params.id);
    if (!data) throw new NotFound("Company not found");

    return this.ok(res, data, "Company successfully retrieved");
  });

  create = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.create(req.body, req.files);
    return this.created(res, data, "Company successfully created");
  });

  update = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.update(req.params.id, req.body, req.files);
    return this.ok(res, data, "Company successfully updated");
  });

  delete = this.wrapper(async (req: Request, res: Response) => {
    const data = await this.#service.delete(req.params.id);
    return this.noContent(res, "Company successfully deleted");
  });
}

export default CompanyController;
