import "express-async-errors";
import cors from "cors";
import helmet from "helmet";
import express from "express";
import pinoHttp from "pino-http";
import * as database from "./database/database";
import { errorMiddleware, notFoundMiddleware } from "./util/error";
import { logger } from "./util/logger";
import { Router } from "./Routes/Router";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(pinoHttp({ logger }));

app.use("/api", Router);

database.connect();

app.use([errorMiddleware, notFoundMiddleware]);

export { app };
