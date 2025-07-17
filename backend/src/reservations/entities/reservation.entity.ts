import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pet } from "../../pets/entities/pet.entity";
// Update the import path if the file is located elsewhere, for example:
import { Service } from "../../services/entities/service.entity";
import { User } from "../../users/entities/user.entity";

export enum ReservationStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected'
}

@Entity('reservation')
export class Reservation {
    @PrimaryGeneratedColumn()
    idreserv: number;

    @Column({ type: 'date' })
    date: Date;

    @Column()
    lieu: string;

    @Column({ type: 'time', default: '09:00' }) 
    time: string;
    
    @Column({
        type: 'enum',
        enum: ReservationStatus,
        default: ReservationStatus.PENDING
    })
    status: ReservationStatus;

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