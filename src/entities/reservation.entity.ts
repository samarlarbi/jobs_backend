import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkerInfo } from './worker.entity';

import { User } from './user.entity';

@Entity()
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
}
