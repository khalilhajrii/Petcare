import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../users/entities/user.entity";
import { VaccinationRecord } from "../../vaccination-record/entities/vaccination-record.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity('pet')
export class Pet {
    @PrimaryGeneratedColumn()
    @ApiProperty({ example: 1, description: 'The unique identifier of the pet' })
    idPet: number;

    @Column()
    @ApiProperty({ example: 'Buddy', description: 'The name of the pet' })
    nom: string;

    @Column()
    @ApiProperty({ example: 'Dog', description: 'The type of the pet' })
    type: string;

    @Column()
    @ApiProperty({ example: 5, description: 'The age of the pet in years' })
    age: number;

    @Column()
    @ApiProperty({ example: 'Golden Retriever', description: 'The breed of the pet' })
    race: string;

    @ManyToOne(() => User, user => user.pets)
    @JoinColumn({ name: 'userId' })
    @ApiProperty({ type: () => User, description: 'The owner of the pet' })
    user: User;

    @Column({ nullable: true })
    @ApiProperty({ example: 1, description: 'The ID of the user who owns the pet' })
    userId: number;

    @OneToMany(() => VaccinationRecord, vaccinationRecord => vaccinationRecord.pet)
    @ApiProperty({ type: () => VaccinationRecord, isArray: true, description: 'The vaccination records of the pet' })
    vaccinationRecords: VaccinationRecord[];
    
    @OneToMany(() => Reservation, reservation => reservation.pet)
    @ApiProperty({ type: () => Reservation, isArray: true, description: 'The reservations associated with the pet' })
    reservations: Reservation[];
}