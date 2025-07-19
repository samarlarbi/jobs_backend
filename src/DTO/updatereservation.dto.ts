import { PartialType } from "@nestjs/mapped-types";
import { reservationDTO } from "./reservation.dto";
export class UpdateReservationDTO extends PartialType(reservationDTO){

}