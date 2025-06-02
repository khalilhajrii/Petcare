import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Pet } from "./pet.entity";

@Entity('vaccination_record')
export class VaccinationRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    nomVaccin: string;

    @Column({ type: 'date' })
    dateVaccination: Date;

    @Column()
    veterinaire: string;

    @ManyToOne(() => Pet, pet => pet.vaccinationRecords)
    @JoinColumn({ name: 'petId' })
    pet: Pet;

    @Column({ nullable: true })
    petId: number;
}