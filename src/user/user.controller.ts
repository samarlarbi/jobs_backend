/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
  Query,
  UseGuards,
  Req,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from '../DTO/user.dto';
import { UpdateUserDto } from '../DTO/updateUser.dto';
import { PaginationDTO } from '../DTO/pagination.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth/jwt-auth.guard';
import { ReservationService } from '../reservation/reservation.service';
import { UpdateReservationDTO } from '../DTO/updatereservation.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { Role } from '../auth/enums/role.enum';
import { RolesGuard } from '../auth/guards/roles/roles.guard';
import { CreateWorkerDto } from '../DTO/worker.dto';
import { CreateUserWorkerDto } from '../DTO/creteuser-worker.dto';
import { reservationDTO } from '../DTO/reservation.dto';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private reservationService: ReservationService,
  ) {}

  @Get("services")
  getallservices()
  {
    return this.userService.getallservices() }

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }
  @Post('worker')
  createworker(@Body() dto:  CreateUserWorkerDto |CreateWorkerDto ) {
    dto.role=Role.WORKER
    console.log(dto);
    console.log(dto.userId);
    return this.userService.createWorker(dto);
  }

  @Get()
  findAll(@Query() paginationdto: PaginationDTO) {
    return this.userService.findAll(paginationdto);
  }

  //   @Get(':id')
  //   findOne(@Param('id', ParseIntPipe) id) {
  //     return this.userService.findOne(id);
  //   }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req) {
    return this.userService.findOne(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('reservation')
  createreservation(@Req() req, @Body() body : reservationDTO) {
    return this.reservationService.createreservation(body);
  }

  @Roles(Role.WORKER)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Put('reservation/:id')
  updatereservation(
    @Req() req,
    @Param('id', ParseIntPipe) resid,
    @Body() dto: UpdateReservationDTO,
  ) {
    // return this.reservationService.updatereservation(req.user.id, resid, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  update(@Req() req, @Body() body: UpdateUserDto) {
    return this.userService.update(req.user.id, body);
  }

  @Roles(Role.CLIENT)
  @UseGuards(RolesGuard)
  @UseGuards(JwtAuthGuard)
  @Delete()
  delete(@Req() req) {
    return this.userService.delete(req.user.id);
  }
}
