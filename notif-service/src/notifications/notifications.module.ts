import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationsService } from './notifications.service';
import { NotificationsResolver } from './notifications.resolver';
import { NotificationsGateway } from './notifications.gateway';
import { Notification } from '../entities/notification.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Notification])],
  providers: [NotificationsService, NotificationsResolver, NotificationsGateway],
  exports: [NotificationsService],
})
export class NotificationsModule {}
