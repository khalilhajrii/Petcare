import { Entity, Column, PrimaryColumn } from 'typeorm';

export type NotificationType = 'reservation_created' | 'reservation_approved' | 'reservation_rejected';

@Entity('notification')
export class Notification {
  @PrimaryColumn()
  id: string;

  @Column()
  message: string;

  @Column({
    type: 'enum',
    enum: ['reservation_created', 'reservation_approved', 'reservation_rejected'],
  })
  type: NotificationType;

  @Column({ default: false })
  read: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ nullable: true })
  reservationId: number;

  @Column()
  userId: number;
}