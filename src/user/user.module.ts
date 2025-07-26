import { Module, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { ReservationService } from 'src/reservation/reservation.service';
import { Reservation } from 'src/entities/reservation.entity';
import { WorkerInfo } from 'src/entities/worker.entity';
import { OffShift } from 'src/entities/offShift.entity';
import { Service } from 'src/entities/service.entity';
import { WorkerServices } from 'src/entities/worker_service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Reservation,WorkerInfo,OffShift,Service,WorkerServices])],
  controllers: [UserController],
  providers: [
    {
      provide:APP_PIPE,
      useValue: new ValidationPipe({
        whitelist:true,
        forbidNonWhitelisted:true,
        transform:true,
        transformOptions:{
          enableImplicitConversion:true
        }
      })
    },
    
    UserService,ReservationService],
})
export class UserModule {}
