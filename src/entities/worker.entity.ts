import {
  ChildEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Reservation } from './reservation.entity';
import { forwardRef } from '@nestjs/common';
import { Service } from './service.entity';
@Entity()
export class Worker {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: String;
  @Column()
  email: String;
  @Column()
  location: String;
  

  @ManyToMany(()=>Service,(service)=>service.workers)
  @JoinTable({name:"workers_services"})
  services:Service[]

  @Column()
  phone: String;

  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations: Reservation[];
  

  @OneToMany(() => Reservation, (reservation) => reservation.worker)
  requests: Reservation[];


}
