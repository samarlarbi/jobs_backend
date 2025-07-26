import { Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkerInfo } from "src/entities/worker.entity";
import { WorkerController } from "./worker.controller";
import { WorkerService } from "./worker.service";
import { APP_PIPE } from "@nestjs/core/constants";
import { Reservation } from "src/entities/reservation.entity";
import { ReservationService } from "src/reservation/reservation.service";
import { OffShift } from "src/entities/offShift.entity";
import { Service } from "src/entities/service.entity";
import { WorkerServices } from "src/entities/worker_service.entity";

@Module(
    {
        imports:[TypeOrmModule.forFeature([WorkerInfo,Reservation, OffShift,Service,WorkerServices])],
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


