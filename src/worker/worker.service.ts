import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWorkerDto } from 'src/DTO/updateWorker.dto';
import { CreateWorkerDto } from 'src/DTO/worker.dto';
import { Worker } from 'src/entities/worker.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkerService {

    constructor(@InjectRepository(Worker) private workerrepo:Repository<Worker>){}
    async create(dto: CreateWorkerDto) {
        return await this.workerrepo.save(dto);
      }
    
      findAll(id: number) {}
    
      async findOne(id: number) {
        const worker = await this.workerrepo.findOne({
          where: {
            id,
          },
        });
        if (!worker) throw new NotFoundException();
        return worker;
      }
    
      async update(id: number, dto: UpdateWorkerDto) {
        return await this.workerrepo.update({ id }, dto);
      }
    
      async delete(id: number) {
        return await this.workerrepo.delete({
          id,
        });
      }
}
