import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { reservationDTO } from 'src/DTO/reservation.dto';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {

    constructor(@InjectRepository(Reservation) private reservationrepo: Repository<Reservation>) {}

    async createreservation(dto:reservationDTO){
        const reservation = this.reservationrepo.create({ ...dto,
    client: { id: dto.client },   // turn client number into a User object
    worker: { id: dto.worker }, })
            return await this.reservationrepo.save(reservation)
    }

}
