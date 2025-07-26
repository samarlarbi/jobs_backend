import { IsNumber, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./user.dto";
import { Role } from "../auth/enums/role.enum";

export class CreateWorkerDto {
    @IsString()
     role=Role.WORKER
     @IsNumber()
  userId: number;
  @IsOptional()
   @IsString()
      service?:string

}