import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../auth/enums/role.enum';

export class CreateUserDto {
  
  @IsString()
  role:Role

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  location: string;

  @IsString()
  @IsNotEmpty()
  phone: string;
}
