import express from 'express';
import cors from 'cors';
import notesRoutes from './routes/notes.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

export function createApp() {
    const app = express();
    app.use(cors());
    app.use(express.json());
    app.use(notesRoutes);
    app.use(errorHandler);
    return app;
}