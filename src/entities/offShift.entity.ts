import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { WorkerInfo } from './worker.entity';


@Entity()
export class OffShift {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({type:'date'})
  day: string; 

  @Column({type:'time'})
  startTime: string; 

  @Column({type:'time'})
  endTime: string; 

  @ManyToOne(() => WorkerInfo, (worker) => worker.offShifts, { onDelete: 'CASCADE' })
  worker: WorkerInfo;
}
