import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { WorkerInfo } from './worker.entity';


@Entity()
@Unique(['day', 'startTime', 'endTime', 'worker'])
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
