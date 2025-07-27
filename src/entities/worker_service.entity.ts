import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { WorkerInfo } from './worker.entity';
import { Service } from './service.entity';

@Entity('workers_services')
export class WorkerServices {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WorkerInfo, (worker) => worker.workerServices, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workerId' })
  worker: WorkerInfo;

  @Column()
  workerId: number;
 @Column({nullable:true})
  description: string;
  @ManyToOne(() => Service, (service) => service.workers, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'serviceId' })
  service: Service;

  @Column()
  serviceId: number;

  @Column({nullable:true})
  price: number;

  
}
