import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsEmail()
  email: string;
  @IsString()
  password : string
  @IsString()
  location:string
  @IsString()
  phone:string

  }
