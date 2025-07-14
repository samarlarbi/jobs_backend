import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Worker } from './worker.entity';

import { User } from './user.entity';
import { forwardRef } from '@nestjs/common';

@Entity()
export class Reservation {
  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  CreatedAt: Date;

  @ManyToOne(() => Worker, (worker) => worker.requests)
  worker: Worker;
  @ManyToOne(() => User, (client) => client.reservations)
  client: User;
  @Column({default:"pending"})
  status:string
}
