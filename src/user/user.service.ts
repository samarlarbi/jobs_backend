/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, MoreThanOrEqual, Repository } from 'typeorm';

import { Role } from '../auth/enums/role.enum';
import { CreateUserWorkerDto } from '../DTO/creteuser-worker.dto';
import { PaginationDTO } from '../DTO/pagination.dto';
import { UpdateUserDto } from '../DTO/updateUser.dto';
import { CreateUserDto } from '../DTO/user.dto';
import { CreateWorkerDto } from '../DTO/worker.dto';

import { User } from '../entities/user.entity';
import { WorkerInfo } from '../entities/worker.entity';
import { Service } from '../entities/service.entity';
import { WorkerServices } from '../entities/worker_service.entity';
import { OffShift } from '../entities/offShift.entity';
import { Reservation } from '../entities/reservation.entity';

import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private reservationservice: ReservationService,
    @InjectRepository(WorkerInfo) private workerRepo: Repository<WorkerInfo>,
    @InjectRepository(Service) private servicesrepo: Repository<Service>,
    @InjectRepository(WorkerServices) private workerservicesrepo: Repository<WorkerServices>,
    @InjectRepository(OffShift) private offshiftrepo: Repository<OffShift>,
    @InjectRepository(Reservation) private reservationrepo: Repository<Reservation>,
  ) {}

  async getallservices() {
    return await this.servicesrepo.find({
      skip: 0,
      take: 10,
    });
  }

  async getallworkersservices() {
    const list = await this.workerservicesrepo.find({
      skip: 0,
      take: 10,
    });

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // e.g., '2025-07-28'
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`; // 'HH:mm'

    const result = await Promise.all(
      list.map(async (item) => {
        const [worker, service, isOffNow, hasReservationNow] = await Promise.all([
          this.userRepo.findOne({ where: { id: item.workerId } }),
          this.servicesrepo.findOne({ where: { id: item.serviceId } }),
          this.offshiftrepo.findOne({
            where: {
              worker: { userId: item.workerId },
              day: currentDate,
              startTime: LessThanOrEqual(currentTime),
              endTime: MoreThanOrEqual(currentTime),
            },
          }),
          this.reservationrepo.findOne({
            where: {
              worker: { userId: item.workerId },
              day: currentDate,
              startTime: LessThanOrEqual(currentTime),
              endTime: MoreThanOrEqual(currentTime),
            },
          }),
        ]);

        return {
          ...item,
          isOffNow: !!isOffNow,
          hasReservationNow: !!hasReservationNow,
          workerInfo: worker,
          serviceInfo: service,
        };
      }),
    );

    return result;
  }

  async createWorker(dto: CreateWorkerDto | CreateUserWorkerDto) {
    if (dto.userId) {
      const worker = await this.workerRepo.findOne({
        where: { userId: dto.userId },
      });

      if (worker) {
        throw new ConflictException('Worker already created');
      }

      const user = await this.userRepo.find({
        where: { id: dto.userId },
      });

      if (user.length === 1) {
        await this.userRepo.update({ id: dto.userId }, { role: Role.WORKER });
        const newWorker = this.workerRepo.create(dto);
        return this.workerRepo.save(newWorker);
      }
    } else {
      try {
        const newUser = await this.create(dto as CreateUserWorkerDto);
        dto.userId = newUser.id;

        const newWorker = this.workerRepo.create(dto);
        return this.workerRepo.save(newWorker);
      } catch (error) {
        throw new ConflictException('Error, try again!');
      }
    }
  }

  async createReservation(clientId: any, dto: any) {
    // Implement this when needed
    // return this.reservationservice.createreservation(dto);
  }

  async checkemail(email: string) {
    const existingUser = await this.userRepo.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  }

  async create(dto: CreateUserDto | CreateUserWorkerDto) {
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = this.userRepo.create(dto);
    return this.userRepo.save(user);
  }

  async updateHashedRefreshToken(userId: number, hashedRefreshToken: string) {
    return this.userRepo.update({ id: userId }, { hashedRefreshToken });
  }

  async findAll(paginationDto: PaginationDTO) {
    return this.userRepo.find({
      skip: paginationDto.skip,
      take: paginationDto.limit ?? 10,
    });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({ where: { email } });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    return this.userRepo.update({ id }, dto);
  }

  async delete(id: number) {
    return this.userRepo.delete({ id });
  }
}
