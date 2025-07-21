import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserService } from 'src/user/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/entities/user.entity';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import jwtConfig from 'src/auth/config/jwt.config';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import refrechJwtConfig from './config/refrech-jwt.config';
import { RefrechJwtStrategy } from './strategies/refrech.strategy';
import { ReservationService } from 'src/reservation/reservation.service';
import { Reservation } from 'src/entities/reservation.entity';
import { WorkerInfo } from 'src/entities/worker.entity';
import { OffShift } from 'src/entities/offShift.entity';
import { Service } from 'src/entities/service.entity';

@Module({
  imports:[TypeOrmModule.forFeature([User,Reservation,WorkerInfo,OffShift,Service]),
JwtModule.registerAsync(jwtConfig.asProvider()),
ConfigModule.forFeature(jwtConfig),
ConfigModule.forFeature(refrechJwtConfig),

],
  controllers: [AuthController],
  providers:  [AuthService , UserService,LocalStrategy, JwtStrategy,RefrechJwtStrategy,ReservationService],
})
export class AuthModule {}
