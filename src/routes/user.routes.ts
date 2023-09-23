import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { hash, compare } from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import { User } from "../entity";

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

router.post("/login", async (req: Request, res: Response) => {
  const user = {'email': req.body.email, 'password': req.body.password};
  
  userRepository.find({where: { email: user.email }}).then((users: any) => {
    if (users.length == 0) {
      res.status(400).send("Email not found");
      return;
    }

    compare(user.password, users[0].password, (err, result) => {

      const token = jsonwebtoken.sign({userId: users[0].userId}, "ao8YIsmIyq1gm6Z");

      if (result) {
        res.status(200).json({
          token: token,
          userId: users[0].userId
        });
        return;
      } else {
        res.status(400).send("Wrong password");
        return;
      }
    });
  });
});

export { router };
