/* eslint-disable prettier/prettier */
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../auth/enums/role.enum';
import { CreateUserWorkerDto } from '../DTO/creteuser-worker.dto';
import { PaginationDTO } from '../DTO/pagination.dto';
import { UpdateUserDto } from '../DTO/updateUser.dto';
import { CreateUserDto } from '../DTO/user.dto';
import { CreateWorkerDto } from '../DTO/worker.dto';
import { Service } from '../entities/service.entity';
import { User } from '../entities/user.entity';
import { WorkerInfo } from '../entities/worker.entity';
import { ReservationService } from '../reservation/reservation.service';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepo: Repository<User>,
    private reservationservice: ReservationService,
    @InjectRepository(WorkerInfo)
    private workerRepo: Repository<WorkerInfo>,
       @InjectRepository(Service)
    private servicesrepo: Repository<Service>,
  ) {}

  async getallservices(){
       return await this.servicesrepo.find({
      skip: 0,
      take: 10,
    });
  }
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
      take: paginationdto.limit ?? 10,
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
