import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, JoinColumn, OneToMany } from 'typeorm';
import { WorkerInfo } from './worker.entity';
import { Service } from './service.entity';
import { Reservation } from './reservation.entity';

@Entity('workers_services')
export class WorkerServices {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(() => Reservation, (reservation) => reservation.service, {
    cascade: true,
  })
  requests: Reservation[];
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
