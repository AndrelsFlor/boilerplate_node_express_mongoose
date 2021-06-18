import './bootstrap';

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'express-async-errors';

import routes from './routes';

class App {
    constructor() {
        this.databaseConnect();
        this.server = express();

        this.middlewares();
        this.routes();
        this.exceptionHandler();
    }

    // tentar fazer um mock dessa class que extende a outra
    middlewares() {
        this.server.use(cors());
        this.server.use(express.json());
    }

    async databaseConnect() {
        try {
            await mongoose.connect(process.env.DB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            });
        } catch (err) {
            throw new Error(
                JSON.stringify({
                    status: 500,
                    message: `Falha ao conectar com o banco: ${err.message}`,
                })
            );
        }
    }

    routes() {
        this.server.use(routes);
    }

    exceptionHandler() {
        this.server.use(async (err, req, res, next) => {
            try {
                console.error(err);
                const { status, message } = JSON.parse(err.message);
                return res.status(status).json({ error: message });
            } catch (error) {
                return res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
}

module.exports = new App().server;
