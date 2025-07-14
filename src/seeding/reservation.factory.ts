import { Reservation } from "../entities/reservation.entity";
import { setSeederFactory } from "typeorm-extension";

export const ReservationFactory = setSeederFactory(Reservation,( x ) =>
     {
        const reservation = new Reservation();
       
        return reservation;
    })