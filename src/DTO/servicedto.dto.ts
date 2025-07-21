import { IsNumber } from "class-validator";

export class serviceDto {
    @IsNumber()
    servce:number
}