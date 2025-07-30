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
import { WorkerServices } from './worker_service.entity';

@Entity()
export class WorkerInfo {
  @PrimaryColumn()
     userId: number;

  @Column({nullable:true})
  description:string

  @OneToOne(() => User, (user) => user.worker, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

@OneToMany(() => WorkerServices, (ws) => ws.worker, { cascade: true })
workerServices: WorkerServices[];


  @OneToMany(() => OffShift, (offShift) => offShift.worker, { cascade: true })
  offShifts: OffShift[];
}
