import { Module, ValidationPipe } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Worker } from "src/entities/worker.entity";
import { WorkerController } from "./worker.controller";
import { WorkerService } from "./worker.service";
import { APP_PIPE } from "@nestjs/core/constants";

@Module(
    {
        imports:[TypeOrmModule.forFeature([Worker])],
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
            
            WorkerService],

    }
)
export class WorkerModule{}


