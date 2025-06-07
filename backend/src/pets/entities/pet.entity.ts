import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { VaccinationRecord } from "../../vaccination-record/entities/vaccination-record.entity";
import { Reservation } from "../Entity/reservation.entity";

@Entity('pet')
export class Pet {
    @PrimaryGeneratedColumn()
    idPet: number;

    @Column()
    nom: string;

    @Column()
    type: string;

    @Column()
    age: number;

    @Column()
    race: string;

    @ManyToOne(() => User, user => user.pets)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    userId: number;

    @OneToMany(() => VaccinationRecord, vaccinationRecord => vaccinationRecord.pet)
    vaccinationRecords: VaccinationRecord[];
    
    @OneToMany(() => Reservation, reservation => reservation.pet)
    reservations: Reservation[];
}