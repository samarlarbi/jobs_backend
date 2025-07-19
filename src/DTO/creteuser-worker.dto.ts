import { IsNumber, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./user.dto";

export class CreateUserWorkerDto extends CreateUserDto {
     @IsNumber()
     @IsOptional()
  userId: number;
  @IsOptional()
   @IsString()
      service?:string

}