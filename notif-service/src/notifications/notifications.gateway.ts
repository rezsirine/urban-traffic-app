// src/notifications/notifications.gateway.ts
import { WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class NotificationsGateway {
  @WebSocketServer() server: Server;

  // Émettre une notif temps réel à tous les clients connectés
  emitNotification(notification: Notification) {
    this.server.emit('notification', notification);
  }

  // Émettre seulement à un utilisateur
  emitToUser(userId: string, notification: Notification) {
    this.server.to(`user:${userId}`).emit('notification', notification);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.query.userId as string;
    if (userId) client.join(`user:${userId}`);
  }
}

// Entity
@ObjectType() @Entity('notifications')
export class Notification {
  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id: string;
  @Field() @Column() userId: string;
  @Field() @Column() title: string;
  @Field() @Column() message: string;
  @Field() @Column({ default: false }) read: boolean;
  @Field() @CreateDateColumn() createdAt: Date;
}