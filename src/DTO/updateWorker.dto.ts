import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkerDto } from './worker.dto';
import { IsString, IsOptional, IsNotEmpty, IsEmail } from 'class-validator';

export class UpdateWorkerDto extends PartialType(CreateWorkerDto) {
  @IsString()
  @IsOptional()
  imgprofile: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @IsOptional()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  password: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  location: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  phone: string;
}
