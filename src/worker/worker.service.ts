import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffShiftDto } from '../DTO/offShift.dto';
import { UpdateWorkerDto } from '../DTO/updateWorker.dto';
import { CreateWorkerDto } from '../DTO/worker.dto';
import { OffShift } from '../entities/offShift.entity';
import { Service } from '../entities/service.entity';
import { WorkerInfo } from '../entities/worker.entity';
import { WorkerServices } from '../entities/worker_service.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(WorkerInfo) private workerrepo: Repository<WorkerInfo>,
    @InjectRepository(OffShift) private offShiftRepo: Repository<OffShift>,
    @InjectRepository(Service) private servicerepo:Repository<Service> ,
    @InjectRepository(WorkerServices)
    private workerServiceRepo: Repository<WorkerServices>,  ) {}
async addServiceToWorker(workerId: number, serviceId: number, price?: number) {
  const worker = await this.workerrepo.findOne({
    where: { userId: workerId },
  });
  if (!worker) {
    throw new NotFoundException('Worker not found');
  }

  const service = await this.servicerepo.findOne({
    where: { id: serviceId },
  });
  if (!service) {
    throw new NotFoundException('Service not found');
  }

  // check if already linked
  const existing = await this.workerServiceRepo.findOne({
    where: { workerId, serviceId },
  });
  if (existing) {
    throw new ConflictException('Service already assigned to this worker');
  }

  // ✅ create the join entity
  const workerService = this.workerServiceRepo.create({
    workerId: workerId,
    serviceId: serviceId,
    price: price ?? 0, // optional extra column
  });

  // save and return
  return await this.workerServiceRepo.save(workerService);
}


  async create(dto: CreateWorkerDto) {
    return await this.workerrepo.save(dto);
  }

  async addOffShift(dto: OffShiftDto) {
    if (dto.startTime >= dto.endTime) {
      throw new ConflictException('startTime must be earlier than endTime');
    }
    try {
      const offshift = await this.offShiftRepo.create(dto);
      return await this.offShiftRepo.save(offshift);
    } catch (err: any) {
      if (err.code === '23505') {
        throw new ConflictException(
          'OffShift with same day/starttime/endtime already exists for this worker',
        );
      }
      throw new InternalServerErrorException('Unexpected error occurred');
    }
  }

  async findAll() {
    return await this.workerrepo.find();
  }
async getAllOffShifts(id: number) {
  const offshifts = await this.offShiftRepo.find({
    where: { worker: { userId: id } },
  });
  if (!offshifts.length) {
    throw new NotFoundException('No off shifts found for this worker');
  }
  return offshifts;
}


  async findOne(id: number) {}

 async update(userId: number, workerDto: UpdateWorkerDto) {
  const worker = await this.workerrepo.findOne({
    where: { userId },
    relations: ['user'],
  });

  if (!worker) {
    throw new NotFoundException('Worker not found');
  }

  // Extract User-related fields from DTO
  const { name, email, password, location, phone, imgprofile, ...workerFields } = workerDto;

  // Update worker-specific fields (like description, if present in workerFields)
  Object.assign(worker, workerFields);

  // Update User entity fields
  if (worker.user) {
    if (name !== undefined) worker.user.name = name;
    if (email !== undefined) worker.user.email = email;
   
    if (location !== undefined) worker.user.location = location;
    if (phone !== undefined) worker.user.phone = phone;
    if (imgprofile !== undefined) worker.user.imgprofile = imgprofile;
  }

  // Save user first (important for FK relations)
  await this.workerrepo.manager.save(worker.user);

  // Save worker
  return await this.workerrepo.save(worker);
}
async deleteOffShift(id: number) {
  const offshift = await this.offShiftRepo.findOne({ where: { id } });
  if (!offshift) {
    throw new NotFoundException('OffShift not found');
  }
  return await this.offShiftRepo.remove(offshift);
}

async deleteWorkerService(workerId: number, id: number) {
  const workerService = await this.workerServiceRepo.findOne({
    where: { workerId, id },
  });
  if (!workerService) {
    throw new NotFoundException('WorkerService relation not found');
  }
  return await this.workerServiceRepo.remove(workerService);
}


  async delete(id: number) {}
}
