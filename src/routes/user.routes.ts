import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { hash, compare } from "bcrypt";
import authMiddleware, {generateToken} from "../authMiddleware";

const userRepository = AppDataSource.getRepository("User");

const router = Router();

// POST /register
/*
{
  "username": "username",
  "password": "password",
  "email": "email",
  "adress": "adress",
  "city": "city",
  "country": "country"
}
*/
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


// POST /login
/*
{
  "email": "email",
  "password": "password"
}
*/
router.post("/login", async (req: Request, res: Response) => {
  const user = {'email': req.body.email, 'password': req.body.password};
  
  userRepository.find({where: { email: user.email }}).then((users: any) => {
    if (users.length == 0) {
      res.status(400).send("Email not found");
      return;
    }

    compare(user.password, users[0].password, (err, result) => {

      const token = generateToken(users[0].userId);

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

// PUT /user/:id
/*
{
	"username": "username",
	"email": "email",
	"adress": "adress",
	"city": "city",
	"country": "country"
}
*/
router.put("/user/:id", authMiddleware, async (req: Request, res: Response) => {
  const body = req.body;

  if (!body.username && !body.email && !body.adress && !body.city && !body.country) {
    res.status(400).send("Missing fields");
    return;
  }

  const user = userRepository.findOne({where: { userId: req.params.id }}).then( async (user: any) => {
    if (!user) {
      res.status(400).send("User not found");
      return;
    }

    user = {
      username: body.username || user.username,
      email: body.email || user.email,
      adress: body.adress || user.adress,
      city: body.city || user.city,
      country: body.country || user.country
    }

    await userRepository.update(req.params.id, user);
    const updatedUser = await userRepository.findOne({where: { userId: req.params.id }});
    console.log(updatedUser);
    res.status(200).send(updatedUser);
    return;
  });
});

export { router };
