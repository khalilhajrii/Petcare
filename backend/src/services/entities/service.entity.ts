import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Reservation } from "./reservation.entity";

@Entity('service')
export class Service {
    @PrimaryGeneratedColumn()
    idservice: number;

    @Column()
    nomservice: string;

    @Column({ type: 'float' })
    prixService: number;

    @Column()
    description: string;

    @Column()
    servicedetail: string;

    @ManyToMany(() => Reservation, reservation => reservation.services)
    reservations: Reservation[];
}