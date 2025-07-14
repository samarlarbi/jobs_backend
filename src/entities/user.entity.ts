import {  BeforeInsert, Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn, TableInheritance } from "typeorm";
import { Reservation } from "./reservation.entity";
import * as bycrypt from "bcrypt"
@Entity()

export class User{
    @PrimaryGeneratedColumn()
    id:number
    @Column({default:"123"})
    password:string
    @Column()
    name:String
    @Column()
    email:String
    @Column()
    location:String
    @Column()
    phone:String
    @OneToMany(()=>Reservation,(reservation)=>reservation.client)
    reservations:Reservation []
    @Column( {nullable:true})
    hashedRefreshToken:string
    @BeforeInsert()
    async hashPassword(){
        this.password = await bycrypt.hash(this.password, 10)
    }
    
    

}