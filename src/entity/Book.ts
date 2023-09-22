import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User, Swap, type as typeEnum } from "./index";

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    bookId: number;

    @Column({
        length: 30
    })
    isbn: string;

    @ManyToOne(() => User, (user: User) => user.books)
    userId: User;

    @Column({
        type: "enum",
        enum: typeEnum
    })
    type: typeEnum;

    @OneToMany(() => Swap, (swap: Swap) => swap.book1Id)
    swaps1: Swap[];

    @OneToMany(() => Swap, (swap: Swap) => swap.book2Id)
    swaps2: Swap[];
};
