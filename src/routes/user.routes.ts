import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (req: Request, res: Response): void => {
  let users = ["Goon", "Tsuki", "Joe"];
  res.status(200).send(users);
});
router.get('/test', (req: Request, res: Response) => {
  res.status(200).send({'key': 'Hello World!'});
})

export { router };