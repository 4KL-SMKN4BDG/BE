import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.ts";
import CompanyController from "./company.controller.ts";
import CompanyValidator from "./company.validator.ts";
import { baseValidator } from "../../base/validator.base.ts";
import auth from "../../middlewares/auth.middleware.ts";
import uploader from "../../middlewares/multer.middleware.ts";

const r = Router(),
  validator = CompanyValidator,
  controller = new CompanyController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  uploader("/companyLogo", "image").fields([
    { name: "logo" }
  ]),
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  controller.create
  );
  
  r.put(
    "/update/:id",
    uploader("/companyLogo", "image").fields([
      { name: "logo" }
    ]),
    auth(['ADMIN']),
    validatorMiddleware({ body: validator.update }),
    controller.update
    );
    
r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const companyRouter = r;
export default companyRouter;
