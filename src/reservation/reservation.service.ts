import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { reservationDTO } from 'src/DTO/reservation.dto';
import { UpdateReservationDTO } from 'src/DTO/updatereservation.dto';
import { Reservation } from 'src/entities/reservation.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ReservationService {

    constructor(@InjectRepository(Reservation) private reservationrepo: Repository<Reservation>) {}

//    async createreservation(dto:any){



    //     const reservation = this.reservationrepo.create({ ...dto,
            

    // clientId: { id: dto.client },  

    // workerd: { id: dto.worker }, })


    //         return await this.reservationrepo.save(reservation)


    // }


//     async updatereservation(id:number,reservationid:number ,dto : UpdateReservationDTO){

//         const reservation =await this.reservationrepo.findOne({
//             where:{
//                 id:reservationid,
//                 worker:{id}
//             }
//         })
//         console.log(id);
//         console.log(reservation);
//         if(!reservation) throw new NotFoundException("reservation not found")


//         return await this.reservationrepo.update({id:reservationid},{ status: dto.status,
//     worker: { id: dto.worker },  
//     client: { id: dto.client }, 
//   })
//     }

}
