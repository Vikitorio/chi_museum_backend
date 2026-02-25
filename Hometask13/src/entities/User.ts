import { IsEmail, IsString, MinLength } from "class-validator";
import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number

    @Column({ type: "varchar", length: 255 })
    @MinLength(3)
    @IsString()
    name!: string

    @Column({ type: "varchar", length: 255 })
    @IsEmail()
    email!: string
}