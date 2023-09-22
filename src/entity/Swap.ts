import {Entity, PrimaryGeneratedColumn, Column, ManyToOne} from "typeorm";
import { Book, states as statesEnum } from "./index";

@Entity()
export class Swap {
        @PrimaryGeneratedColumn()
        swapId: number;
    
        @ManyToOne(() => Book, (book: Book) => book.swaps1)
        book1Id: number;

        @Column({
            type: "enum",
            enum: statesEnum
        })
        state1: statesEnum;

        @ManyToOne(() => Book, (book: Book) => book.swaps2)
        book2Id: number;

        @Column({
            type: "enum",
            enum: statesEnum
        })
        state2: statesEnum;

        @Column()
        distanceInMeters: number;
    }