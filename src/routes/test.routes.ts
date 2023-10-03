import { Router, request, response } from "express";
import { matchAlgorithm } from "../services";
import { Swap, Book, User } from "../entity";
import { AppDataSource } from "../data-source";
import { Repository } from "typeorm";

const router = Router({mergeParams: true});

const userRepository: Repository<User> = AppDataSource.getRepository("User");
const bookRepository: Repository<Book> = AppDataSource.getRepository("Book");
const swapRepository: Repository<Swap> = AppDataSource.getRepository("Swap");

router.get("/", async (request, response) => {
    const book: Book | null = await bookRepository.findOne({where: {user: {id: 1}}, relations: ["user"]});

    if (book === null) {
        response.send("No book found");
        return;
    }
    const numberOfSwaps: Number = await matchAlgorithm(book, 20);

    response.json({numberOfSwaps: numberOfSwaps});
});

export { router };
