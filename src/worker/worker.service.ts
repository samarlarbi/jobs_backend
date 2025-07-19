import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateWorkerDto } from 'src/DTO/updateWorker.dto';
import { CreateWorkerDto } from 'src/DTO/worker.dto';
import { WorkerInfo } from 'src/entities/worker.entity';
import { Repository } from 'typeorm';

@Injectable()
export class WorkerService {

    constructor(@InjectRepository(WorkerInfo) private workerrepo:Repository<WorkerInfo>){}
    async create(dto: CreateWorkerDto) {
        return await this.workerrepo.save(dto);
      }

      
    
      async findAll() {

       return await this.workerrepo.find()
      }
    
      async findOne(id: number) {
       
      }
    
      async update(id: number, dto: UpdateWorkerDto) {
        // return await this.workerrepo.update({ id }, dto);
      }
    
      async delete(id: number) {
       
      }
}
