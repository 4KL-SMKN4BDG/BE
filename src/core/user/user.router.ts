import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.ts";
import UserController from "./user.controller.ts";
import UserValidator from "./user.validator.ts";
import { baseValidator } from "../../base/validator.base.ts";
import auth from "../../middlewares/auth.middleware.ts";

const r = Router(),
  validator = UserValidator,
  controller = new UserController();

r.get(
  "/show-all",
  validatorMiddleware({ query: baseValidator.browseQuery }),
  controller.findAll
);

r.get("/show-one/:id", controller.findById);

r.post(
  "/create",
  auth(['ADMIN']),
  validatorMiddleware({ body: validator.create }),
  controller.create
  );
  
  r.put(
    "/update/:id",
    auth(['ADMIN']),
    validatorMiddleware({ body: validator.update }),
    controller.update
    );
    
r.delete("/delete/:id", auth(['ADMIN']), controller.delete);

const userRouter = r;
export default userRouter;
