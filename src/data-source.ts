import "reflect-metadata"
import { DataSource } from "typeorm"
import { User, Book, Swap } from "./entity/index"

import * as dotenv from "dotenv";
dotenv.config();

let AppDataSource = new DataSource({
    type: "mysql",
    extra: { socketPath: "/cloudsql/swapr-399612:europe-west1:swapr"},
    host: "104.199.94.6",
    port: 3306,
    username: "api",
    password: ">r^UF,{.9/;|?YiA",
    database: "Swapr",
    entities: [User, Book, Swap],
    synchronize: true
})

if (process.env.DEV_ENABLED) {
    AppDataSource = new DataSource({
        type: "mysql",
        host: process.env.DB_HOST || "localhost",
        port: Number(process.env.DB_PORT) || 3306,
        username: process.env.DB_USERNAME || "root",
        password: process.env.DB_PASSWORD || "root",
        database: process.env.DB_NAME || "Swapr",
        entities: [User, Book, Swap],
        synchronize: true
    })
}

export {AppDataSource};
