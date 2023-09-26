import express, { Application, Request, Response, NextFunction } from "express";

import { userRoutes, bookRoutes } from "./routes/index";

const app: Application = express();

app.use(express.json());

app.use("/", userRoutes);
app.use("/user/:userId/book", bookRoutes);

export default app;
