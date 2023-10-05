import { Request, Response } from "express";
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import { AppDataSource } from './data-source';

const key = "ao8YIsmIyq1gm6Z";

export default async (req: Request, res: Response, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).send("Missing authorization header");
        return;
    }

    let data;
    try {
        data = jsonwebtoken.verify(authHeader, key) as JwtPayload;

    } catch (err) {
        res.status(401).send("Invalid token");
        return;
    }
    
    const user = await AppDataSource.getRepository("User").findOne({where: {id: data.userId}})

    if (!user) {
        return res.status(401).send("User not found");
    }

    // Remove && process.env.DEV_ENABLED != "true" when development is done
    if (user.id != req.params.userId && process.env.DEV_ENABLED != "true") {
        return res.status(401).send("Invalid token");
    }

    next();
}

export const generateToken = (userId: number) => {
    return jsonwebtoken.sign({userId: userId}, key);
}
