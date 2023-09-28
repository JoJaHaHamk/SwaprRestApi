import {Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn} from "typeorm";
import { User, Swap } from "./index";
import types from "./type";

@Entity()
export class Book {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 30
    })
    isbn: string;

    @Column()
    title: string;

    @Column()
    author: string;

    @ManyToOne(() => User, (user: User) => user.books)
    user: User;

    @Column({
        type: 'enum',
        enum: types,
        enumName: 'type',
    })
    type: types;

    @OneToMany(() => Swap, (swap: Swap) => swap.book1, {onDelete: "CASCADE"})
    swaps1: Swap[];

    @OneToMany(() => Swap, (swap: Swap) => swap.book2, {onDelete: "CASCADE"})
    swaps2: Swap[];
};
