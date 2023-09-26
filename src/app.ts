import express, { Application, Request, Response, NextFunction } from "express";

import { userRoutes } from "./routes/index";

const app: Application = express();

app.use(express.json());

app.use("/", userRoutes);

export default app;
