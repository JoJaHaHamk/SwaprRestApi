import authMiddleware, {generateToken} from "../authMiddleware";
import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { states } from "../entity/index";

const router = Router({mergeParams: true});

const UserRepository = AppDataSource.getRepository("User");
const bookRepository = AppDataSource.getRepository("Book");
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
    const transformedSwaps1 = swaps1.map((swap) => ({
        swapId: swap.swapId,
        wantedBookIsbn: swap.book1.isbn,
        ownedBookIsbn: swap.book2.isbn,
        distance: "to be calculated",
    }));
    const transformedSwaps2 = swaps2.map((swap) => ({
        swapId: swap.swapId,
        wantedBookIsbn: swap.book2.isbn,
        ownedBookIsbn: swap.book1.isbn,
        distance: "to be calculated",
    }));
    const swaps = transformedSwaps1.concat(transformedSwaps2);
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

// When a user tries to update the state of a swap, we need to check if the swap exists and if the user is the owner of one of the books in the swap. Then we change the state of the book of the user.

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
    let swap = await swapRepository.createQueryBuilder("swap")
        .innerJoinAndSelect('swap.book1', 'book1')
        .innerJoinAndSelect('swap.book2', 'book2')
        .innerJoinAndSelect('book1.user', 'user1')
        .innerJoinAndSelect('book2.user', "user2")
        .where('swap.id = :id', {id: req.params.swapId})
        .getOne();
    
    // check if the swap exists, if not send a 400 Bad Request response to let the user now what's wrong
    if (!swap) {
        res.status(400).send("Swap not found");
        return;
    }

    const swapToReturn = {
        swapId: swap.id,
        wantedBookIsbn: "",
        ownedBookIsbn: "",
        distance: swap.distanceInMeters,
    };

    if (swap.book1.user.id == req.params.userId) {
        swap.state1 = body.state;
        swapToReturn.wantedBookIsbn = swap.book2.isbn;
        swapToReturn.ownedBookIsbn = swap.book1.isbn;
    } else if (swap.book2.user.id == req.params.userId) {
        swap.state2 = body.state;
        swapToReturn.wantedBookIsbn = swap.book1.isbn;
        swapToReturn.ownedBookIsbn = swap.book2.isbn;
    } else {
        res.status(400).send("User not found");
        return;
    }

    swap = await swapRepository.save(swap);

    // Send the updated swap as a response
    res.status(200).json(swapToReturn);
});

export {router};
