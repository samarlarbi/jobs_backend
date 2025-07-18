import { Controller, Req, UseGuards } from '@nestjs/common';
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
import { UpdateReservationDTO } from 'src/DTO/updatereservation.dto';
import { ReservationService } from 'src/reservation/reservation.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
@Controller('worker')
export class WorkerController {
    constructor(private workerService : WorkerService,
      private reservationService: ReservationService
    ){}
     @Post()
      create(@Body() dto: CreateWorkerDto) {
        return this.workerService.create(dto);
      }
    
      @Get()
      findAll() {
       return this.workerService.findAll()
      }
    
      @Get(':id')
      findOne(@Param('id', ParseIntPipe) id) {
        return this.workerService.findOne(id);
      }
    
@UseGuards(JwtAuthGuard)

        @Put("reservation/:id")
        updatereservation(@Req() req,@Param('id',ParseIntPipe) resid ,@Body() dto: UpdateReservationDTO){
          // return this.reservationService.updatereservation(req.user.id,resid,dto)
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
