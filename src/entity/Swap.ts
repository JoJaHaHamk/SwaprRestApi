import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn} from "typeorm";
import { Book } from "./index";
import states from "./states";

@Entity()
export class Swap {

    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Book, (book: Book) => book.swaps1)
    book1: Book;

    @Column({
        type: "enum",
        enum: states,
        enumName: "states"
    })
    state1: states;

    @ManyToOne(() => Book, (book: Book) => book.swaps2)
    book2: Book;

    @Column({
        type: "enum",
        enum: states,
        enumName: "states"
    })
    state2: states;

    @Column()
    distanceInMeters: number;
}
