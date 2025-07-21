import { IsNumber, IsOptional, IsString } from "class-validator";
import { CreateUserDto } from "./user.dto";
import { Role } from "src/auth/enums/role.enum";
export class CreateUserWorkerDto extends CreateUserDto {
   
   @IsNumber()
     @IsOptional()
  userId: number;
  @IsOptional()
   @IsString()
      service?:string

}