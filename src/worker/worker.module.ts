import { Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkerInfo } from "../entities/worker.entity";
import { WorkerController } from "./worker.controller";
import { WorkerService } from "./worker.service";
import { APP_PIPE } from "@nestjs/core/constants";
import { Reservation } from "../entities/reservation.entity";
import { ReservationService } from "../reservation/reservation.service";
import { OffShift } from "../entities/offShift.entity";
import { Service } from "../entities/service.entity";
import { WorkerServices } from "../entities/worker_service.entity";
import { User } from "src/entities/user.entity";

@Module(
    {
  imports:[TypeOrmModule.forFeature([User,Reservation,WorkerInfo,OffShift,Service,WorkerServices])],
        controllers:[WorkerController],
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
          
            WorkerService,ReservationService],

    }
)
export class WorkerModule{}


