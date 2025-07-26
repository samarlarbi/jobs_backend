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
import { CreateUserDto } from 'src/DTO/user.dto';
import { UpdateUserDto } from 'src/DTO/updateUser.dto';
import { PaginationDTO } from 'src/DTO/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { ReservationService } from 'src/reservation/reservation.service';
import { UpdateReservationDTO } from 'src/DTO/updatereservation.dto';
import { Roles } from 'src/auth/decorator/roles.decorator';
import { Role } from 'src/auth/enums/role.enum';
import { RolesGuard } from 'src/auth/guards/roles/roles.guard';
import { CreateWorkerDto } from 'src/DTO/worker.dto';
import { CreateUserWorkerDto } from 'src/DTO/creteuser-worker.dto';
import { reservationDTO } from 'src/DTO/reservation.dto';

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
