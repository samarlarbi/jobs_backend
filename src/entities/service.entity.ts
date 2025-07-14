import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Worker } from "./worker.entity";

@Entity()
export class Service{
    @PrimaryGeneratedColumn()
    id:number
    @Column()
    title:string
    @ManyToMany(()=>Worker,(worker)=>worker.services)
    workers:Worker[]
}