import express, { Application, Request, Response, NextFunction } from "express";

import { userRoutes, bookRoutes, swapRoutes, testRoutes } from "./routes/index";

const app: Application = express();

app.use(express.json());

app.use("/", userRoutes);
app.use("/user/:userId/book", bookRoutes);
app.use("/user/:userId/swap", swapRoutes);
app.use("/test", testRoutes);

export default app;
