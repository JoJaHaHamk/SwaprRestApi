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

    const data: JwtPayload = jsonwebtoken.verify(authHeader, key) as JwtPayload;
    
    const user = await AppDataSource.getRepository("User").findOne({where: {userId: data.userId}})

    if (!user) {
        return res.status(401).send("User not found");
    }

    next();
}

export const generateToken = (userId: number) => {
    return jsonwebtoken.sign({userId: userId}, key);
}