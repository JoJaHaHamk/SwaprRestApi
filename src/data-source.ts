import "reflect-metadata"
import { DataSource } from "typeorm"
import { User, Book, Swap } from "./entity/index"

import * as dotenv from "dotenv";
dotenv.config();

let AppDataSource = new DataSource({
    type: "mysql",
    extra: { socketPath: "/cloudsql/swapr-399612:europe-west1:swapr"},
    host: process.env.DB_HOST || "104.199.94.6",
    port: Number(process.env.DB_PORT) || 3306,
    username: process.env.DB_USERNAME || "api",
    password: process.env.DB_PASSWORD || ">r^UF,{.9/;|?YiA",
    database: process.env.DB_NAME || "Swapr",
    synchronize: true,
    logging: false,
    entities: [User, Book, Swap],
})

export {AppDataSource};
