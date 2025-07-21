import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  TableInheritance,
} from 'typeorm';
import { Reservation } from './reservation.entity';
import * as bycrypt from 'bcrypt';
import { Role } from 'src/auth/enums/role.enum';
import { WorkerInfo } from './worker.entity';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ default: '123' })
  password: string;
  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;
  @Column()
  name: String;
  @Column({ unique: true })
  email: String;
  @Column()
  location: String;
  @Column()
  phone: String;
  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations: Reservation[];
  @Column({ nullable: true })
  hashedRefreshToken: string;
  @BeforeInsert()
  
  async hashPassword() {
    this.password = await bycrypt.hash(this.password, 10);
  }
  @OneToOne(() => WorkerInfo, (worker) => worker.user, {
    cascade: true,
    nullable: true,
  })
  worker: WorkerInfo;
}
