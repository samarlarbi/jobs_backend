import { IsNumber, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./user.dto";

export class CreateWorkerDto {
     @IsNumber()
  userId: number;
  @IsOptional()
   @IsString()
      service?:string

}