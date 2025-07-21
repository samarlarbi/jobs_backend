import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OffShiftDto } from 'src/DTO/offShift.dto';
import { UpdateWorkerDto } from 'src/DTO/updateWorker.dto';
import { CreateWorkerDto } from 'src/DTO/worker.dto';
import { OffShift } from 'src/entities/offShift.entity';
import { Service } from 'src/entities/service.entity';
import { WorkerInfo } from 'src/entities/worker.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkerService {
  constructor(
    @InjectRepository(WorkerInfo) private workerrepo: Repository<WorkerInfo>,
    @InjectRepository(OffShift) private offShiftRepo: Repository<OffShift>,
    @InjectRepository(Service) private servicerepo:Repository<Service>  ) {}

async addServiceToWorker(workerId: number, serviceId: number) {
  const worker = await this.workerrepo.findOne({
    where: { userId: workerId },
    relations: ['services'], 
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

  const alreadyLinked = worker.services.some((s) => s.id === service.id);
  if (alreadyLinked) {
    throw new ConflictException('Service already assigned to this worker');
  }

  worker.services.push(service);

  return await this.workerrepo.save(worker);
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

  async findOne(id: number) {}

  async update(id: number, dto: UpdateWorkerDto) {
  }

  async delete(id: number) {}
}
