import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";
import { Service } from "./service.entity";

@Entity('payment')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float' })
    montant: number;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    paymentDate: Date;

    @ManyToOne(() => User, user => user.payments)
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column({ nullable: true })
    userId: number;

    @ManyToOne(() => Service)
    @JoinColumn({ name: 'serviceId' })
    service: Service;

    @Column({ nullable: true })
    serviceId: number;
}