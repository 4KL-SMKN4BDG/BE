import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import router from './routes.ts';

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