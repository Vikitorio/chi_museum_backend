import { Expose } from "class-transformer";
import { IsString, IsEmail, MinLength } from "class-validator";

export class CreateUserData {
  @IsString()
  @MinLength(3)
  @Expose()
  name!: string;

  @IsEmail()
  @Expose()
  email!: string
}