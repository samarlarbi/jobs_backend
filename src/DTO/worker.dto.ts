import { IsString } from "class-validator";
import { CreateUserDto } from "./user.dto";

export class CreateWorkerDto extends CreateUserDto{
     @IsString()
      service:string
}