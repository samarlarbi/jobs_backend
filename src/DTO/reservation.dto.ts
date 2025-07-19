import { IsNumber, IsString } from "class-validator";

export class reservationDTO{
    @IsNumber()
    client: number
    @IsNumber()
    worker:  number
    @IsString()
    status="Pending"
}