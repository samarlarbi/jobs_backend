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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from 'src/DTO/user.dto';
import { UpdateUserDto } from 'src/DTO/updateUser.dto';
import { PaginationDTO } from 'src/DTO/pagination.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto);
  }

   @Get()
   findAll(@Query() paginationdto:PaginationDTO) {
 return this.userService.findAll(paginationdto)

 }

//   @Get(':id')
//   findOne(@Param('id', ParseIntPipe) id) {
//     return this.userService.findOne(id);
//   }

@UseGuards(JwtAuthGuard)
@Get("profile")
getProfile(@Req() req ){
  return this.userService.findOne(req.user.id )
}

@UseGuards(JwtAuthGuard)
@Post("reservation")
createreservation(@Req() req , @Body() body){
  return this.userService.createReservation(req.user.id,body)
}


@UseGuards(JwtAuthGuard)
  @Put()
  update(
    @Req() req,
    @Body() body:UpdateUserDto,
  ) {
    return  this.userService.update(req.user.id,body);
  }
@UseGuards(JwtAuthGuard)

  @Delete()
  delete(@Req() req) {
    return this.userService.delete(req.user.id)
  }



}
