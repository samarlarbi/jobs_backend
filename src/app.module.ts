/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerService } from './worker/worker.service';
import { WorkerController } from './worker/worker.controller';
import { WorkerModule } from './worker/worker.module';
import { pgConfig } from 'dbconfig';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ReservationModule } from './reservation/reservation.module';

@Module({
  imports: [UserModule, WorkerModule,ConfigModule.forRoot(
    {
      isGlobal:true,
      envFilePath:".env"
    }
  ) , TypeOrmModule.forRoot(pgConfig), UserModule, AuthModule, ReservationModule , ReservationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
