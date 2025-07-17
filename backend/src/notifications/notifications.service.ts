import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async createReservationNotification(
    type: 'reservation_created' | 'reservation_approved' | 'reservation_rejected',
    userId: number,
    reservationId: number,
    message: string,
  ): Promise<Notification> {
    this.logger.log(`Creating ${type} notification for user ${userId} for reservation ${reservationId}`);
    
    const notification = this.notificationRepository.create({
      id: uuidv4(),
      type,
      userId,
      reservationId,
      message,
      read: false,
      createdAt: new Date(),
    });

    return this.notificationRepository.save(notification);
  }

  async getNotificationsForUser(userId: number): Promise<Notification[]> {
    return this.notificationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new Error(`Notification with id ${id} not found`);
    }

    notification.read = true;
    return this.notificationRepository.save(notification);
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository
      .createQueryBuilder()
      .update(Notification)
      .set({ read: true })
      .where('userId = :userId', { userId })
      .execute();
  }

  async deleteNotification(id: string): Promise<void> {
    await this.notificationRepository.delete(id);
  }

  async deleteAllNotifications(userId: number): Promise<void> {
    await this.notificationRepository.delete({ userId });
  }
}