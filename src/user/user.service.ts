/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from 'src/auth/enums/role.enum';
import { CreateUserWorkerDto } from 'src/DTO/creteuser-worker.dto';
import { OffShiftDto } from 'src/DTO/offShift.dto';
import { PaginationDTO } from 'src/DTO/pagination.dto';
import { reservationDTO } from 'src/DTO/reservation.dto';
import { UpdateUserDto } from 'src/DTO/updateUser.dto';
import { CreateUserDto } from 'src/DTO/user.dto';
import { CreateWorkerDto } from 'src/DTO/worker.dto';
import { Reservation } from 'src/entities/reservation.entity';
import { User } from 'src/entities/user.entity';
import { WorkerInfo } from 'src/entities/worker.entity';
import { ReservationService } from 'src/reservation/reservation.service';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private reservationservice: ReservationService,
    @InjectRepository(WorkerInfo)
    private workerRepo: Repository<WorkerInfo>,
  ) {}

  async createWorker(dto: CreateWorkerDto | CreateUserWorkerDto) {
    if (dto.userId) {
      const worker = await this.workerRepo.findOne({
        where: {
          userId: dto.userId,
        },
      });

      console.log(worker);
      if (worker) throw new ConflictException('worker already created');

      const user = await this.userRepo.find({
        where: {
          id: dto.userId,
        },
      });

      if (user.length == 1) {
        await this.userRepo.update({ id: dto.userId }, { role: Role.WORKER });
        const newWorker = await this.workerRepo.create(dto);
        return this.workerRepo.save(newWorker);
      }
    } else {
      try {
        console.log('**************');
        console.log(dto);

        const newuser = await this.create(dto as CreateUserWorkerDto);
        dto.userId = newuser.id;
        const newWorker = await this.workerRepo.create(dto);
        return this.workerRepo.save(newWorker);
      } catch (error) {
        throw new ConflictException('error , try again !');
      }
    }
  }

  async createReservation(cliendid: any, dto: any) {
    // return this.reservationservice.createreservation(dto);
  }

  async checkemail(emaill: string) {
    const existingUser = await this.userRepo.findOne({
      where: { email: emaill },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }
  }

  async create(dto: CreateUserDto | CreateUserWorkerDto) {
    console.log(dto);
    const existingUser = await this.userRepo.findOne({
      where: { email: dto.email },
    });
    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userRepo.create(dto);

    return await this.userRepo.save(user);
  }

  async updateHashedRefreshToken(userid: number, hashedRefreshToken) {
    return await this.userRepo.update({ id: userid }, { hashedRefreshToken });
  }

  async findAll(paginationdto: PaginationDTO) {
    return await this.userRepo.find({
      skip: paginationdto.skip,
      take: paginationdto.limit ?? DEFAULT_PAGE_SIZE,
    });
  }

  async findByEmail(email: string) {
    return await this.userRepo.findOne({
      where: {
        email,
      },
    });
  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async update(id: number, dto: UpdateUserDto) {
    return await this.userRepo.update({ id }, dto);
  }

  async delete(id: number) {
    return await this.userRepo.delete({
      id,
    });
  }
}
