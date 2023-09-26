import authMiddleware, {generateToken} from "../authMiddleware";
import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { states } from "../entity/index";

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
        res.status(400).send("No swaps found for this user and/or state");
        return;
    }
    // Send the swaps as a response
    res.status(200).send(swaps);
});

// PATCH
/*
{
    "state": "accepted"
}
*/

/*
    How must this work? The bookstate of the user that accepts the swap must be changed to "accepted". 
    The bookstate of the user that proposed the swap must be changed to "pending".
    How do we let the user know that the swap has been accepted?
    Do we use the actual tinder system where both users have to swipe right or 
    does one user swipe right and the other one gets a notification?
*/
router.patch("/:swapId", authMiddleware, async (req: Request, res: Response) => {
    // Get all the fields from the body for easier access
    const body = req.body;
    if (!body.state) {
        res.status(400).send("Missing fields");
        return;
    }
    // Check if the type is valid
    // If not, send a 400 Bad Request response to let the user now what's wrong
    if (!Object.values(states).includes(body.state)) {
        res.status(400).send("Invalid state");
        return;
    }
    // Get the swap from the database to later update
    const swap = await swapRepository.findOne({where: {swapId: req.params.swapId}});
    // check if the swap exists, if not send a 400 Bad Request response to let the user now what's wrong
    if (!swap) {
        res.status(400).send("Swap not found");
        return;
    }
    // Update the swap
    swap.state = body.state;
    // Save the updated swap to the database
    await swapRepository.save(swap);
    // Send the updated swap as a response
    res.status(200).send(swap);
});

export {router};