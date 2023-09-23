import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { hash, compare } from "bcrypt";

const userRepository = AppDataSource.getRepository("User");

const router = Router();

router.post("/register", async (req: Request, res: Response) => {
  
  const body = req.body;
  
  if (!body.username || !body.password || !body.email || !body.adress || !body.city || !body.country) {
    res.status(400).send("Missing fields");
    return;
  }
  
  userRepository.find({where: { email: body.email }}).then((users: any) => {
    if (users.length > 0) {
      res.status(400).send("Email already in use");
      return;
    }
    
    
    hash(body.password, 10, (err, hash) => {
      const user = {
        username: body.username,
        password: hash,
        email: body.email,
        adress: body.adress,
        city: body.city,
        country: body.country
      }
      userRepository.save(user);
      res.status(200).send("OK");
      return;
    });
  });
});

export { router };
