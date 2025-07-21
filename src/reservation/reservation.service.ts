import {
    ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffShiftDto } from 'src/DTO/offShift.dto';
import { reservationDTO } from 'src/DTO/reservation.dto';
import { UpdateReservationDTO } from 'src/DTO/updatereservation.dto';
import { OffShift } from 'src/entities/offShift.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationrepo: Repository<Reservation>,
 @InjectRepository(OffShift)
    private offshiftrepo: Repository<OffShift>,
  ) {}
async createreservation(dto: reservationDTO) {


const offshiftexist = await this.offshiftrepo
  .createQueryBuilder('off')
  .where('off.workerUserId = :workerId', { workerId: dto.worker })
  .andWhere('off.day = :day', { day: dto.day })
  .andWhere('off.startTime < :endTime', { endTime: dto.endTime })
  .andWhere('off.endTime > :startTime', { startTime: dto.startTime })
  .getOne();

     if(offshiftexist){
        throw new ConflictException("worker is not available")
     }

  
  const data = {
    day: dto.day,
    startTime: dto.startTime,
    endTime: dto.endTime,
    status: dto.status,
    worker: { userId: dto.worker } , 
    client: { id: dto.client } 
  };
  try {
    const reservation = this.reservationrepo.create(data);
    return await this.reservationrepo.save(reservation);
    
  } catch (error) {
    if (error.code === "23505")
    {
 throw new ConflictException(
          'reservation with same day/starttime/endtime/worker already exists ',
        );    }
        console.log(error.message);
      throw new InternalServerErrorException('Unexpected error occurred');
  }
}


  async updatereservation(
    id: number,
    reservationid: number,
    dto: UpdateReservationDTO,
  ) {
    const reservation = await this.reservationrepo.findOne({
      where: {
        id: reservationid,
      },
    });
    console.log(id);
    console.log(reservation);
    if (!reservation) throw new NotFoundException('reservation not found');

    return await this.reservationrepo.update(
      { id: reservationid },
      {
        status: dto.status,
        client: { id: dto.client },
      },
    );
  }
}
