import { Module } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { ReservationController } from './reservation.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from 'src/entities/reservation.entity';
import { OffShift } from 'src/entities/offShift.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Reservation,OffShift])],
  providers: [ReservationService],
  controllers: [ReservationController]
})
export class ReservationModule {}
