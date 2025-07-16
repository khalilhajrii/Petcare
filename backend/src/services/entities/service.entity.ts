import { Reservation } from "src/reservations/entities/reservation.entity";
import { User } from "src/users/entities/user.entity";
import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
    
    @Column({ nullable: true })
    userId: number;
    
    @ManyToOne(() => User, user => user.services, { nullable: true })
    user: User;

    @ManyToMany(() => Reservation, reservation => reservation.services)
    reservations: Reservation[];
}