// Make an algorithm to match users
/*
    TODO: Create a filter that makes sure that a swap that is accepted by one user will not be available for another swap
*/



import { Swap, User, Book, states } from "../entity";
import { AppDataSource } from "../data-source";
import { Repository, In, Not } from "typeorm";
import { types } from "../entity";
import { distanceListCalculator } from "./distanceCalculator";

const userRepository: Repository<User> = AppDataSource.getRepository(User);
const bookRepository: Repository<Book> = AppDataSource.getRepository(Book);
const swapRepository: Repository<Swap> = AppDataSource.getRepository(Swap);

// Book should have user relation
const matchAlgorithm = async (book: Book, maxSwaps: number): Promise<Number> => {
    // * Data Retrieval

    // This is the most important part of the function. This is where the incomming data is filtered. If any changed happen to the algorithm, this will most likely be the starting point.
    //const availableBooks = await bookRepository.find({where: {type: types.owned, user: {city: book.user.city, country: book.user.country, id: Not(book.user.id)}, isbn: book.isbn}, relations: ["user"]});
    const availableBooks = await bookRepository.find({where: {type: types.owned, user: {id: Not(book.user.id)}, isbn: book.isbn}, relations: ["user"]});
    const availableUsers = availableBooks.map((book) => book.user.id);
    const userAvailableBooks = await bookRepository.find({where: {type: types.owned, user: {id: book.user.id}}, relations: ["user"]});
    const requestedBooks: any[] = await bookRepository.find({where: {type: types.requested, user: {id: In(availableUsers)}, isbn: In(userAvailableBooks.map((book) => book.isbn))}, relations: ["user"]});

    const availableSwapList = requestedBooks.map((item, index) => ({
        item,
        book,
        distance: 0
    }));

    // Distance Calculation

    const users = availableSwapList.map((item) => item.item.user);
    const distances = await distanceListCalculator(book.user, users);

    for (let i = 0; i < availableSwapList.length; i++) {
        availableSwapList[i].distance = distances[i];
    }

    // Data Processing

    availableSwapList.sort((a, b) => (a.distance < b.distance ? -1 : 1));

    // Create Swaps

    const temp: Swap[] = [];

    availableSwapList.forEach((availableSwap, index) => {
        if (index > maxSwaps) {
            return;
        }

        const swap = new Swap();
        swap.book1 = availableSwap.book.id;
        swap.book2 = availableSwap.item.id;
        swap.state1 = "match" as states;
        swap.state2 = "match" as states;
        swap.distanceInMeters = availableSwap.distance;
        swapRepository.save(swap);
    });

    // Output
    return 1;
};

export { matchAlgorithm };
