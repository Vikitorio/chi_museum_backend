import { Expose } from "class-transformer";
import { IsString, IsEmail, MinLength, IsOptional } from "class-validator";

export class UpdateUserData {
    @IsOptional()
    @IsString()
    @MinLength(3)
    @Expose()
    name!: string;

    @IsOptional()
    @IsEmail()
    @Expose()
    email!: string
}