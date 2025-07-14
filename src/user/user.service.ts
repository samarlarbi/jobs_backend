/* eslint-disable prettier/prettier */
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDTO } from 'src/DTO/pagination.dto';
import { reservationDTO } from 'src/DTO/reservation.dto';
import { UpdateUserDto } from 'src/DTO/updateUser.dto';
import { CreateUserDto } from 'src/DTO/user.dto';
import { Reservation } from 'src/entities/reservation.entity';
import { User } from 'src/entities/user.entity';
import { ReservationService } from 'src/reservation/reservation.service';
import { DEFAULT_PAGE_SIZE } from 'src/utils/constants';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepo: Repository<User>,
    private reservationservice: ReservationService,
  
) {

  

}



  async createReservation(cliendid:number,dto : reservationDTO)
{
  dto.client= cliendid
 
return this.reservationservice.createreservation(dto);

  }


  async create(dto: CreateUserDto) {
    const user = await this.userRepo.create(dto)

    return await this.userRepo.save(user);
  }

  async updateHashedRefreshToken(
userid:number , hashedRefreshToken ){
      return await this.userRepo.update({id:userid} , {hashedRefreshToken})

}

  



 async findAll(paginationdto: PaginationDTO) {

    return await this.userRepo.find({
      skip: paginationdto.skip,
      take: paginationdto.limit ?? DEFAULT_PAGE_SIZE
    })


  }

  async  findByEmail(email:string){

    return await this.userRepo.findOne(
      {
        where:{
          email
        }

      }
    )

  }

  async findOne(id: number) {
    const user = await this.userRepo.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new NotFoundException();
    return  user;
  }

  async update(id: number, dto: UpdateUserDto) {
    return await this.userRepo.update({ id }, dto);
  }

  async delete(id: number) {
    return await this.userRepo.delete({
      id,
    });
  }
}
