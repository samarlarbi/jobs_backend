/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Role } from '../auth/enums/role.enum';
import { CreateUserWorkerDto } from '../DTO/creteuser-worker.dto';
import { PaginationDTO } from '../DTO/pagination.dto';
import { UpdateUserDto } from '../DTO/updateUser.dto';
import { CreateUserDto } from '../DTO/user.dto';
import { CreateWorkerDto } from '../DTO/worker.dto';
import { Service } from '../entities/service.entity';
import { User } from '../entities/user.entity';
import { WorkerInfo } from '../entities/worker.entity';
import { WorkerServices } from '../entities/worker_service.entity';
import { OffShift } from 'src/entities/offShift.entity';
import { Reservation } from 'src/entities/reservation.entity';
import { ReservationService } from '../reservation/reservation.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private reservationservice: ReservationService,
    @InjectRepository(WorkerInfo) private workerRepo: Repository<WorkerInfo>,
    @InjectRepository(Service) private servicesRepo: Repository<Service>,
    @InjectRepository(WorkerServices) private workerServicesRepo: Repository<WorkerServices>,
    @InjectRepository(OffShift) private offShiftRepo: Repository<OffShift>,
    @InjectRepository(Reservation) private reservationRepo: Repository<Reservation>,
  ) {}

  async getAllServices() {
    return await this.servicesRepo.find({
      skip: 0,
      take: 10,
    });
  }

  async getAllWorkersServices() {
    const list = await this.workerServicesRepo.find({
      skip: 0,
      take: 10,
    });

    const now = new Date();
    const currentDate = now.toISOString().split('T')[0]; // YYYY-MM-DD
    const currentTime = now.toTimeString().slice(0, 5); // HH:mm

    const result = await Promise.all(
      list.map(async (item) => {
        const [worker, service, isOffNow, hasReservationNow] = await Promise.all([
          this.userRepo.findOne({ where: { id: item.workerId } }),
          this.servicesRepo.findOne({ where: { id: item.serviceId } }),
          this.offShiftRepo.findOne({
            where: {
              worker: { userId: item.workerId },
              day: currentDate,
              startTime: LessThanOrEqual(currentTime),
              endTime: MoreThanOrEqual(currentTime),
            },
          }),
          this.reservationRepo.findOne({
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
      const existingWorker = await this.workerRepo.findOne({
        where: { userId: dto.userId },
      });

      if (existingWorker) {
        throw new ConflictException('Worker already exists');
      }

      const user = await this.userRepo.findOne({
        where: { id: dto.userId },
      });

      if (user) {
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
        throw new ConflictException('Error creating worker, try again!');
      }
    }
  }

  async checkEmail(email: string) {
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

  async findAll(pagination: PaginationDTO) {
    return this.userRepo.find({
      skip: pagination.skip,
      take: pagination.limit ?? 10,
    });
  }

  async findByEmail(email: string) {
    return this.userRepo.findOne({
      where: { email },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({ where: { id } });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    return this.userRepo.update({ id }, dto);
  }

  async delete(id: number) {
    return this.userRepo.delete({ id });
  }
}
