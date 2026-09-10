import express from 'express';
import cors from 'cors';
import recordRoutes from './routes/records.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(recordRoutes);
    app.use(errorHandler);
    return app;
}