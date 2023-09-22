import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany} from "typeorm";
import { User, Swap } from "./index";
import types from "./type";

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
        type: 'enum',
        enum: types,
        enumName: 'type',
    })
    type: types;

    @OneToMany(() => Swap, (swap: Swap) => swap.book1Id)
    swaps1: Swap[];

    @OneToMany(() => Swap, (swap: Swap) => swap.book2Id)
    swaps2: Swap[];
};
