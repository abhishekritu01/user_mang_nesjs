// src/user/dto/create-user.dto.ts
import { IsNotEmpty, IsEmail, MinLength, IsDateString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  surname: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @IsDateString()
  birthdate: Date;
}
