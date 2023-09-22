import "reflect-metadata";
import { AppDataSource } from "./data-source";
import app from "./app";

import * as dotenv from "dotenv";
dotenv.config();

const PORT: number = Number(process.env.PORT) || 5050;

AppDataSource.initialize().then(async () => {

    console.log("Database initialized");

    app.listen(PORT, (): void => console.log(`Server running on port ${PORT}`));

}).catch(error => console.log(error))

