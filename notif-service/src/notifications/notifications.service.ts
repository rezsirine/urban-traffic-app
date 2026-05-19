import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from '../entities/notification.entity';
import { SendNotificationInput } from './dto/send-notification.input';
import { NotificationsGateway } from './notifications.gateway';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification) private notifRepo: Repository<Notification>,
    private gateway: NotificationsGateway,
  ) {}

  async sendNotification(input: SendNotificationInput): Promise<Notification> {
    const notif = this.notifRepo.create(input);
    const saved = await this.notifRepo.save(notif);

    // Emit event via WebSocket
    this.gateway.server.emit(`notification_${input.userId}`, saved);

    return saved;
  }

  async notifications(userId: string): Promise<Notification[]> {
    return this.notifRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async markAsRead(id: string): Promise<Notification> {
    const notif = await this.notifRepo.findOne({ where: { id } });
    if (!notif) throw new NotFoundException('Notification not found');

    notif.isRead = true;
    return this.notifRepo.save(notif);
  }
}
