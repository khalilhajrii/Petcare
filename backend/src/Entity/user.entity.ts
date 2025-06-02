import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Role } from "./role.entity";
import { Pet } from "./pet.entity";
import { Reservation } from "./reservation.entity";
import { Payment } from "./payment.entity";

@Entity('user')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

    @Column({ select: false })
    password: string;

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    phone: string;

    @Column()
    address: string;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: true })
    disponibilite: boolean;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn({ name: 'roleId' })
    role: Role;

    @Column({ nullable: true })
    roleId: number;
    
    @OneToMany(() => Pet, pet => pet.user)
    pets: Pet[];
    
    @OneToMany(() => Reservation, reservation => reservation.user)
    reservations: Reservation[];
    
    @OneToMany(() => Payment, payment => payment.user)
    payments: Payment[];
}