import authMiddleware, {generateToken} from "../authMiddleware";
import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { types } from "../entity/index"

const router = Router({mergeParams: true});

const bookRepository = AppDataSource.getRepository("Book");
const userRepository = AppDataSource.getRepository("User");

// GET /user/:userId/book
router.get("/", authMiddleware, async (req: Request, res: Response) => {
    // Get all the books from the database
    const books = await bookRepository.find({where: {userId: req.params.userId}});

    // Send the books as a response
    res.status(200).send(books);
});

// POST /user/:userId/book
/*
{
    "isbn": "978-3-16-148410-0",
    "type": "owned"
}
*/
router.post("/", authMiddleware, async (req: Request, res: Response) => {
    // Get all the fields from the body for easier access
    const body = req.body;

    // Check if all the fields are present
    // If not, send a 400 Bad Request response to let the user now what's wrong
    if (!body.isbn || !body.type) {
        res.status(400).send("Missing fields");
        return;
    }
    // Check if the type is valid
    // If not, send a 400 Bad Request response to let the user now what's wrong
    if (!Object.values(types).includes(body.type)) {
        res.status(400).send("Invalid type");
        return;
    }

    // Get the user from the database to later add to the new book
    const user = await userRepository.findOne({where: {userId: req.params.userId}});

    // check if the user exists, if not send a 400 Bad Request response to let the user now what's wrong
    if (!user) {
        res.status(400).send("User not found");
        return;
    }

    // Create the new book object to save later
    const book = {
        isbn: body.isbn,
        userId: user,
        type: body.type
    }

    // Save the new book to the database
    const result = await bookRepository.save(book);

    // Send the new book as a response
    res.status(200).send(result);
});

export { router };