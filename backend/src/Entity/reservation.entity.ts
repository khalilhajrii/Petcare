import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pet } from "./pet.entity";
import { Service } from "./service.entity";
import { User } from "./user.entity";

@Entity('reservation')
export class Reservation {
    @PrimaryGeneratedColumn()
    idreserv: number;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    lieu: string;

    @Column()
    time: string;

    @ManyToOne(() => Pet, pet => pet.reservations)
    @JoinColumn({ name: 'petId' })
    pet: Pet;

    @Column({ nullable: true })
    petId: number;
    
    @ManyToOne(() => User, user => user.reservations)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    userId: number;

    @ManyToMany(() => Service, service => service.reservations)
    @JoinTable({
        name: 'reservation_services', // Name of the junction table
        joinColumn: {
            name: 'reservationId',
            referencedColumnName: 'idreserv'
        },
        inverseJoinColumn: {
            name: 'serviceId',
            referencedColumnName: 'idservice'
        }
    })
    services: Service[];
}