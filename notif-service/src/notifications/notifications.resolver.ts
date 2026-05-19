import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { NotificationsService } from './notifications.service';
import { Notification } from '../entities/notification.entity';
import { SendNotificationInput } from './dto/send-notification.input';

@Resolver(() => Notification)
export class NotificationsResolver {
  constructor(private readonly notifService: NotificationsService) {}

  @Mutation(() => Notification)
  sendNotification(@Args('input') input: SendNotificationInput) {
    return this.notifService.sendNotification(input);
  }

  @Query(() => [Notification])
  notifications(@Args('userId') userId: string) {
    return this.notifService.notifications(userId);
  }

  @Mutation(() => Notification)
  markNotificationAsRead(@Args('id') id: string) {
    return this.notifService.markAsRead(id);
  }
}
