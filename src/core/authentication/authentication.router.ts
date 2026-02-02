import { Router } from "express";
import validatorMiddleware from "../../middlewares/validator.middleware.ts";
import AuthenticationController from "./authentication.controller.ts";
import AuthenticationValidator from "./authentication.validator.ts";
import { baseValidator } from "../../base/validator.base.ts";
import auth from "../../middlewares/auth.middleware.ts";

const r = Router(),
  validator = AuthenticationValidator,
  controller = new AuthenticationController();

r.post(
  '/login',
  validatorMiddleware({ body: validator.login }),
  controller.login
);

r.post(
  '/reset-password',
  validatorMiddleware({ body: validator.resetPassword }),
  controller.resetPassword
);

r.post(
  '/refresh',
  validatorMiddleware({ body: validator.refresh }),
  controller.refresh
);

r.post(
  '/register',
  validatorMiddleware({ body: validator.register }),
  controller.register
);

r.post(
  '/advanced-register',
  validatorMiddleware({ body: validator.advancedRegister }),
  controller.advancedRegister
)

const authenticationRouter = r;
export default authenticationRouter;
