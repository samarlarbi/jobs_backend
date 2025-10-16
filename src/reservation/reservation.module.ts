import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { OffShift } from '../entities/offShift.entity';
import { WorkerServices } from 'src/entities/worker_service.entity';
import { Service } from 'src/entities/service.entity';
import { User } from 'src/entities/user.entity';
import { WorkerInfo } from 'src/entities/worker.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Reservation,WorkerInfo,OffShift,Service,WorkerServices])],
  providers: [ReservationService],
  controllers: [ReservationController]
})
export class ReservationModule {}
