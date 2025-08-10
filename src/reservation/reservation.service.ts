import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
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

  // Helper to get YYYY-MM-DD in local timezone (avoids UTC issues)
  private getLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  async getTodaysReservationsCountForWorker(workerId: number): Promise<number> {
    const today = this.getLocalDateString(new Date());
    return this.reservationrepo.count({
      where: { day: today, service: { worker: { userId: workerId } } },
      relations: ['client', 'service', 'service.worker', 'service.service'],
    });
  }

  async getTotalReservationsCountForWorker(workerId: number): Promise<number> {
    return this.reservationrepo.count({
      where: { service: { worker: { userId: workerId } } },
      relations: ['client', 'service', 'service.worker', 'service.service'],
    });
  }

  async getWeeklyReservationsCountForWorker(
    workerId: number,
    mode: 'week' | 'last7' = 'week',
  ) {
    const today = new Date();
    let startOfRange: Date;
    let endOfRange: Date;

    if (mode === 'week') {
      // Current week: Monday → Sunday
      const dayOfWeek = today.getDay() === 0 ? 7 : today.getDay(); // Sunday = 7
      startOfRange = new Date(today);
      startOfRange.setDate(today.getDate() - (dayOfWeek - 1)); // Move to Monday
      endOfRange = new Date(startOfRange);
      endOfRange.setDate(startOfRange.getDate() + 6); // Sunday
    } else {
      // Last 7 days rolling range
      startOfRange = new Date(today);
      startOfRange.setDate(today.getDate() - 6);
      endOfRange = new Date(today);
    }

    const startDate = this.getLocalDateString(startOfRange);
    const endDate = this.getLocalDateString(endOfRange);

    console.log(`Querying reservations for worker ${workerId} between ${startDate} and ${endDate}`);

    // Query reservations in date range
    const reservations = await this.reservationrepo
      .createQueryBuilder('reservation')
      .select('reservation.day', 'day')
      .addSelect('COUNT(reservation.id)', 'count')
      .innerJoin('reservation.service', 'service')
      .innerJoin('service.worker', 'worker')
      .where('worker.userId = :workerId', { workerId })
      .andWhere('reservation.day >= :startDate', { startDate })
      .andWhere('reservation.day <= :endDate', { endDate })
      .groupBy('reservation.day')
      .orderBy('reservation.day', 'ASC')
      .getRawMany();

    // Normalize 'day' field to 'YYYY-MM-DD' string for correct matching
    const normalizedReservations = reservations.map(r => ({
      day: new Date(r.day).toISOString().split('T')[0],
      count: parseInt(r.count, 10),
    }));

    console.log('Reservations found:', normalizedReservations);

    // Build full week result with counts (0 if none)
    const result: { day: string; count: number }[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfRange);
      d.setDate(startOfRange.getDate() + i);
      const formatted = this.getLocalDateString(d); // 'YYYY-MM-DD'
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
      const found = normalizedReservations.find(r => r.day === formatted);
      result.push({
        day: dayName,
        count: found ? found.count : 0,
      });
    }

    return result;
  }

  async getTodaysReservationsListForWorker(workerId: number) {
    const today = this.getLocalDateString(new Date());
    return this.reservationrepo.find({
      where: { day: today, service: { worker: { userId: workerId } } },
      relations: ['client', 'service', 'service.worker', 'service.service'],
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
async deletereservation(id: number): Promise<void> {
  const reservation = await this.reservationrepo.findOne({ where: { id } });
  if (!reservation) {
    throw new NotFoundException(`Reservation with id ${id} not found`);
  }
  await this.reservationrepo.delete(id);
}
  async getallreservation(id: number) {
  const reservations= await this.reservationrepo.find({
    where: {
      client: { id: id }
    },
    relations: {
      client:true,
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

async getallworkerreservation(id: number) {
  const reservations = await this.reservationrepo.find({
    where: {
      service: { worker: { user: { id } } }
    },
    relations: {
      client: true, // you need this to get client.name
      service: {
        service: true, // only if WorkerServices has a relation "service"
        worker: {
          user: true
        }
      }
    },
    skip: 0,
    take: 10,
  });

  return reservations.map(res => ({
    id: res.id,
    startTime: res.startTime,
    endTime: res.endTime,
    day: res.day,
    clientname: res.client.name,
    status: res.status,
    title: res.service.service.title,
  }));
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
      },
      client:true
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
    userimg: res.client.imgprofile,
    username:res.client.name,
    userphone:res.client.phone,
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
      },
    );
  }
}
