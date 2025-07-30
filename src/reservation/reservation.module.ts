import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { OffShift } from '../entities/offShift.entity';
import { WorkerServices } from 'src/entities/worker_service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Reservation,OffShift,WorkerServices])],
  providers: [ReservationService],
  controllers: [ReservationController]
})
export class ReservationModule {}
