import authMiddleware, {generateToken} from "../authMiddleware";
import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { types } from "../entity/index"

const router = Router({mergeParams: true});

const bookRepository = AppDataSource.getRepository("Book");
const userRepository = AppDataSource.getRepository("User");
const swapRepository = AppDataSource.getRepository("Swap");

// GET /user/:userId/swap
/*
{
    "state": "pending"
}
*/
router.get("/", authMiddleware, async (req: Request, res: Response) => {
    // Get all the swaps from the database
    const swaps1 = await swapRepository.createQueryBuilder("swap").innerJoin('swap.book1Id', 'book').where('state = :state', {state: req.body.state}).where('book.userId = :userId', {userId: req.params.userId}).getMany();
    const swaps2 = await swapRepository.createQueryBuilder("swap").innerJoin('swap.book2Id', 'book').where('state = :state', {state: req.body.state}).where('book.userId = :userId', {userId: req.params.userId}).getMany();
    const swaps = swaps1.concat(swaps2);
    // If no swaps are found, send a 400 Bad Request response to let the user now what's wrong
    if (swaps.length == 0) {
        res.status(400).send("No swaps found for this user");
        return;
    }
    // Send the swaps as a response
    res.status(200).send(swaps);
});

export {router};