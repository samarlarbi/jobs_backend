import { User } from './user.entity';
import {
  ChildEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import { Service } from './service.entity';
import { OffShift } from './offShift.entity';

@Entity()
export class WorkerInfo {
  @PrimaryColumn()
  userId: number;

  @OneToOne(() => User, (user) => user.worker, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @ManyToMany(() => Service, (service) => service.workers)
  @JoinTable({ name: 'workers_services' })
  services: Service[];
  @OneToMany(() => Reservation, (reservation) => reservation.worker, {
    cascade: true,
  })
  requests: Reservation[];

  @OneToMany(() => OffShift, (offShift) => offShift.worker, { cascade: true })
  offShifts: OffShift[];
}
