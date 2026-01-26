import express from 'express';
import authenticationRouter from './core/authentication/authentication.router.ts';

const router = express.Router();


export const routeLists = [
    {
        path: '/auth',
        route: authenticationRouter
    }
]

routeLists.forEach((route) => {
    router.use(route.path, route.route);
});

export default router;