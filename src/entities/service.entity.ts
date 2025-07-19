import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { WorkerInfo } from "./worker.entity";

@Entity()
export class Service{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    title:string
    @ManyToMany(()=>WorkerInfo,(worker)=>worker.services)
    workers:WorkerInfo[]
}