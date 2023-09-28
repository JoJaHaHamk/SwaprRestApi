import authMiddleware, {generateToken} from "../authMiddleware";
import { Router, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { types } from "../entity/index"

const router = Router({mergeParams: true});

const bookRepository = AppDataSource.getRepository("Book");
const userRepository = AppDataSource.getRepository("User");

// GET /user/:userId/book
router.get("/", authMiddleware, async (req: Request, res: Response) => {

    const type = req.query.type as types;
    const search = req.query.search;

    if (!type) {
        res.status(400).send("Missing type");
        return;
    }
    if (!Object.values(types).includes(type)) {
        res.status(400).send("Invalid type");
        return;
    }

    // Get all the books from the database
    const books = await bookRepository.find({where: {"user.id": req.params.userId, type: type}});

    if (books.length == 0) {
        res.status(400).send("No books found for this user");
        return;
    }

    if (search) {
        const filteredBooks = books.filter(book => book.title.toLowerCase().includes(String(search).toLowerCase()) || book.author.toLowerCase().includes(String(search).toLocaleLowerCase()));
        if (filteredBooks.length == 0) {
            res.status(400).send("No books found for this search");
            return;
        }
        res.status(200).send(filteredBooks);
        return;
    }

    // Send the books as a response
    res.status(200).send(books);
});

// POST /user/:userId/book
/*
{
    "isbn": "978-3-16-148410-0",
    "title": "The Lord of the Rings",
    "author": "J. R. R. Tolkien",
    "type": "owned"
}
*/
router.post("/", authMiddleware, async (req: Request, res: Response) => {
    // Get all the fields from the body for easier access
    const body = req.body;

    // Check if all the fields are present
    // If not, send a 400 Bad Request response to let the user now what's wrong
    if (!body.isbn || !body.type || !body.title || !body.author) {
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
    const user = await userRepository.findOne({where: {id: req.params.userId}});

    // check if the user exists, if not send a 400 Bad Request response to let the user now what's wrong
    if (!user) {
        res.status(400).send("User not found");
        return;
    }

    // Create the new book object to save later
    const book = {
        isbn: body.isbn,
        user: user,
        title: body.title,
        author: body.author,
        type: body.type
    }

    // Save the new book to the database
    const result = await bookRepository.save(book);

    // Send the new book as a response
    res.status(200).send(result);
});

// DELETE /user/:userId/book/:bookId
router.delete("/:bookId", authMiddleware, async (req: Request, res: Response) => {
    // Get the book from the database
    const book = await bookRepository.findOne({where: {"user.id": req.params.userId, id: req.params.bookId}});

    // Check if the book exists
    // If not, send a 400 Bad Request response to let the user know what's wrong
    if (!book) {
        res.status(400).send("Book not found or not owned by authorized user");
        return;
    }

    // Delete the book from the database
    const result = await bookRepository.delete(book);

    // Send a 200 OK response
    res.status(200).send("Book deleted");
});

export { router };
