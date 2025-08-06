import {
    ConflictException,
  Injectable,
  InternalServerErrorException,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffShiftDto } from '../DTO/offShift.dto';
import { reservationDTO } from '../DTO/reservation.dto';
import { UpdateReservationDTO } from '../DTO/updatereservation.dto';
import { OffShift } from '../entities/offShift.entity';
import { Reservation } from '../entities/reservation.entity';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';
import { WorkerServices } from '../entities/worker_service.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationrepo: Repository<Reservation>,
 @InjectRepository(OffShift)
    private offshiftrepo: Repository<OffShift>,
     @InjectRepository(WorkerServices)
    private workerrepo: Repository<WorkerServices>,

  ) {}







  async getTodaysReservationsCountForWorker(workerId: number): Promise<number> {
    const today = new Date().toISOString().split('T')[0];
    return this.reservationrepo.count({
      where: { day: today, service: { worker: { userId: workerId } } },
      relations: ['service', 'service.worker'],
    });
  }

  async getTotalReservationsCountForWorker(workerId: number): Promise<number> {
    return this.reservationrepo.count({
      where: { service: { worker: { userId: workerId } } },
      relations: ['service', 'service.worker'],
    });
  }

  async getWeeklyReservationsCountForWorker(workerId: number): Promise<{ day: string; count: number }[]> {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday

    const startDate = startOfWeek.toISOString().split('T')[0];
    const endDate = endOfWeek.toISOString().split('T')[0];

    const reservations = await this.reservationrepo
      .createQueryBuilder('reservation')
      .select("reservation.day", "day")
      .addSelect("COUNT(*)", "count")
      .innerJoin('reservation.service', 'service')
      .innerJoin('service.worker', 'worker')
      .where("worker.userId = :workerId", { workerId })
      .andWhere("reservation.day BETWEEN :startDate AND :endDate", { startDate, endDate })
      .groupBy("reservation.day")
      .orderBy("reservation.day", "ASC")
      .getRawMany();

    const result: { day: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const formatted = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(); // MON, TUE...
      const found = reservations.find(r => r.day === formatted);
      result.push({
        day: dayName,
        count: found ? parseInt(found.count, 10) : 0,
      });
    }

    return result;
  }

  async getTodaysReservationsListForWorker(workerId: number) {
    const today = new Date().toISOString().split('T')[0];
    return this.reservationrepo.find({
      where: { day: today, service: { worker: { userId: workerId } } },
      relations: ['client', 'service', 'service.worker'],
      order: { startTime: 'ASC' },
    });
  }

  async getStats(workerId: number) {
    const todayCount = await this.getTodaysReservationsCountForWorker(workerId);
    const totalCount = await this.getTotalReservationsCountForWorker(workerId);
    const weeklyData = await this.getWeeklyReservationsCountForWorker(workerId);
    const todayList = await this.getTodaysReservationsListForWorker(workerId);

    return {
      todayCount,
      totalCount,
      weeklyData,
      todayList: todayList.map(r => ({
        id: r.id,
        clientName: r.client?.name || 'Unknown',
        serviceName: r.service?.service.title || 'Unknown Service',
        status: r.status,
        startTime: r.startTime,
        endTime: r.endTime,
      })),
    };
  }
  async getallreservation(id: number) {
  const reservations= await this.reservationrepo.find({
    where: {
      client: { id: id }
    },
    relations: {
      service: {
        service: true,
        worker: {
          user: true 
        }
      }
    },
    skip: 0,
    take: 10,
  });
  return reservations.map((res)  =>
    ( {
       id: res.id,
    startTime: res.startTime,
    endTime: res.endTime,  
      day:res.day,
      clientname:res.client.name

   , status: res.status,
    title: res.service.service.title,
    
    })
  
       
);
}
 async getreservation(id: number) {
  const res= await this.reservationrepo.findOne({
    where: {
      id: id
    },
    relations: {
      service: {
        service: true,
        worker: {
          user: true 
        }
      }
    },
  
  });
  if (!res) {
    throw new NotFoundException(`Reservation not found`);
  }
  return {
    id: res.id,
    startTime: res.startTime,
    endTime: res.endTime,
    day:res.day,
    status: res.status,
    title: res.service.service.title,
    serviceDescription: res.service.description,
    workerName: res.service.worker.user.name,
    workerId: res.service.worker.userId,
    workerImg: res.service.worker.user.imgprofile,
    workerPhone: res.service.worker.user.phone,


  };
}

async createreservation(dto: reservationDTO) {

const worker= await this.workerrepo.findOne({
  where:{
    id:dto.serviceId
    
  }
})
if (!worker) {
      throw new NotFoundException(`Worker service with ID ${dto.serviceId} not found`);
    }


const offshiftexist = await this.offshiftrepo
  .createQueryBuilder('off')
  .where('off.workerUserId = :workerId', { workerId: worker.workerId })
  .andWhere('off.day = :day', { day: dto.day })
  .andWhere('off.startTime < :endTime', { endTime: dto.endTime })
  .andWhere('off.endTime > :startTime', { startTime: dto.startTime })
  .getOne();

    
     
    const hasReservationNow = await this.reservationrepo.findOne({
  where: {
    service: { id: dto.serviceId }, 
    day: dto.day,
    startTime: LessThanOrEqual(dto.endTime),
    endTime: MoreThanOrEqual( dto.startTime),
  },
});

 if(offshiftexist || hasReservationNow){
        throw new ConflictException("worker is not available")
     }
  
  const data = {
    day: dto.day,
    startTime: dto.startTime,
    endTime: dto.endTime,
   status: dto.status || 'pending',
    service: {id: dto.serviceId  }, 
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
