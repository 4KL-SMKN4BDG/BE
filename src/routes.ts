import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.ts';
import userRouter from './core/user/user.router.ts';
import companyRouter from './core/company/company.router.ts';

const router = express.Router();


export const routeLists = [
    {
        path: '/auth',
        route: authenticationRouter
    },
    {
        path: '/user',
        route: userRouter
    },
    {
        path: '/company',
        route: companyRouter
    }
]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;