import { Controller } from '@nestjs/common';
import { WorkerService } from './worker.service';
import {
  
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateWorkerDto } from 'src/DTO/worker.dto';
import { UpdateWorkerDto } from 'src/DTO/updateWorker.dto';
@Controller('worker')
export class WorkerController {
    constructor(private workerService : WorkerService){}
     @Post()
      create(@Body() dto: CreateWorkerDto) {
        return this.workerService.create(dto);
      }
    
      @Get()
      findAll() {}
    
      @Get(':id')
      findOne(@Param('id', ParseIntPipe) id) {
        return this.workerService.findOne(id);
      }
    
      @Put(':id')
      update(
        @Param('id' , ParseIntPipe) id,
        @Body() body:UpdateWorkerDto,
      ) {
        return  this.workerService.update(id,body);
      }
    
      @Delete(':id')
      delete(@Param('id' , ParseIntPipe) id) {
        return this.workerService.delete(id)
      }
}
