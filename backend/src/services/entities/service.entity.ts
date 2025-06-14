import { Reservation } from "src/reservations/entities/reservation.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

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