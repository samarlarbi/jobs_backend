import { IsNumber } from "class-validator";

export class reservationDTO{
    @IsNumber()
    client:number
    @IsNumber()
    worker: number
}