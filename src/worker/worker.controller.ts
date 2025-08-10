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
import { CreateWorkerDto } from '../DTO/worker.dto';
import { UpdateWorkerDto } from '../DTO/updateWorker.dto';
import { UpdateReservationDTO } from '../DTO/updatereservation.dto';
import { ReservationService } from '../reservation/reservation.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { OffShift } from '../entities/offShift.entity';
import { OffShiftDto } from '../DTO/offShift.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
@Controller('worker')
export class WorkerController {
  constructor(
    private workerService: WorkerService,
    private reservationService: ReservationService,
  ) {}
  @Post()
  create(@Body() dto: CreateWorkerDto) {
    return this.workerService.create(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.workerService.findAll();
  }
  
  @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Get('offshift')
  getOffShifts(@Req() req, ) {
    console.log("object");
    console.log(req.user.id);
    return this.workerService.getAllOffShifts(req.user.id);
  }
  

  @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Delete('offshift/:id')
  deletOffShifts(@Req() req, @Param('id', ParseIntPipe) id) {
    console.log("object");
    console.log(req.user.id);
    return this.workerService.deleteOffShift(id);
  }
 @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Delete('workerservice/:id')
  deletworkerservice(@Req() req, @Param('id', ParseIntPipe) id) {
    console.log("object");
    console.log(req.user.id);
    return this.workerService.deleteWorkerService(req.user.id,id);
  }

 @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Delete('reservation')
  getworkerreservation(@Req() req) {
   
    return this.reservationService.getallworkerreservation(req.user.id);
  }



  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id) {
    return this.workerService.findOne(id);
  }

  @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Post('services/:serviceId')
  async addService(
    @Req() req,
    @Param('serviceId', ParseIntPipe) serviceId: number,
  ) {
    try {
      return this.workerService.addServiceToWorker(req.user.id, serviceId);
    } catch (error) {
      console.log(`${error.message}`);
    }
  }
  @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Post('offshift')
  addOffShift(@Req() req, @Body() dto: OffShiftDto) {
    console.log(dto);
    console.log(req.user.id);

    dto.worker = req.user.id;
    console.log(dto);

    return this.workerService.addOffShift(dto);
  }





  @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Put('reservation/:id')
  updatereservation(
    @Req() req,
    @Param('id', ParseIntPipe) resid,
    @Body() dto: UpdateReservationDTO,
  ) {
    // return this.reservationService.updatereservation(req.user.id,resid,dto)
  }



  @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Put('')
  updateservice(@Req() req, @Body() body: UpdateWorkerDto) {
    return this.workerService.update(req.user.id, body);
  }





  @Roles(Role.WORKER)
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id) {
    return this.workerService.delete(id);
  }
}
