import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes.ts';
import { StatusCodes } from 'http-status-codes';
import path from 'path';
import fs from 'fs';

const app = express();

const port = process.env.PORT || 3000;

app.disable('x-powered-by');
app.use(
    cors({
        origin: '*',
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTION',
        credentials: true,
    })
);

app.use(
    express.json({
        limit: '50mb',
        type: ['application/json', 'application/vnd.api+json'],
    })
);
app.use(
    express.urlencoded({
        limit: '50mb',
        parameterLimit: 50000,
        extended: true,
    })
);
app.use(
    express.raw({ type: ['application/json', 'application/vnd.api+json'] }) 
);
app.use(express.text({ type: 'text/html' }));

app.use('/api/v1', router);

app.get('/api/download', (req, res, next) => {
    const filePath = req.query.path;
    if(!filePath) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            status: false,
            code: StatusCodes.BAD_REQUEST,
            message: 'File path not provided.',
        });
    }

    const resolvedPath = path.resolve(filePath as string);

    fs.access(resolvedPath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(StatusCodes.NOT_FOUND).json({
                status: false,
                code: StatusCodes.NOT_FOUND,
                message: 'FIle not found.',
            });
        }

    res.sendFile(resolvedPath, (err) => {
        if (err) {
            console.error('Error sending file: ', err);
            return next(err);
        }
    });
    });
});

app.route('/').get((req, res) => {
    return res.json({
        messages: 'Welcome to the API',
    })
});

app.use((req, res) => {
    return res.json({
        errors: {
            status: res.statusCode,
            data: null,
            error: {
                code: '404 NOT FOUND',
                message: 'ENDPOINT_NOTFOUND',           }
        }
    })
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})

// test push to main branch.4