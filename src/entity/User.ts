import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Book } from "./index";

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column()
    adress: string;

    @Column()
    city: string;

    @Column()
    country: string;

    @OneToMany(() => Book, (book: Book) => book.user, {onDelete: "CASCADE"})
    books: Book[];

}
