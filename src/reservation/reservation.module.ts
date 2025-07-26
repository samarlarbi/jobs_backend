import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from '../entities/reservation.entity';
import { OffShift } from '../entities/offShift.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Reservation,OffShift])],
  providers: [ReservationService],
  controllers: [ReservationController]
})
export class ReservationModule {}
