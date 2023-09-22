import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Book } from "./index";
import states from "./states";

@Entity()
export class Swap {
    @PrimaryGeneratedColumn()
    swapId: number;

    @ManyToOne(() => Book, (book: Book) => book.swaps1)
    book1Id: number;

    @Column({
        type: "enum",
        enum: states,
        enumName: "states"
    })
    state1: states;

    @ManyToOne(() => Book, (book: Book) => book.swaps2)
    book2Id: number;

    @Column({
        type: "enum",
        enum: states,
        enumName: "states"
    })
    state2: states;

    @Column()
    distanceInMeters: number;
}
