import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { WorkerInfo } from './worker.entity';

import { User } from './user.entity';

@Entity()
@Unique(['worker','client','day','startTime','endTime'])
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @ManyToOne(() => WorkerInfo, (worker) => worker.requests)
  worker: WorkerInfo;
  @ManyToOne(() => User, (client) => client.reservations)
  client: User;
  @Column({default:"pending"})
  status:string
   @Column({type:'date'})
  day: string; 

  @Column({type:'time'})
  startTime: string; 

  @Column({type:'time'})
  endTime: string; 
  
}
