import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { NotificationsService } from './notifications.service';

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})
export class NotificationsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger('NotificationsGateway');
  private userSocketMap: Map<number, string[]> = new Map();

  @WebSocketServer() server: Server;

  constructor(private notificationsService: NotificationsService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    // Remove client from userSocketMap
    this.userSocketMap.forEach((socketIds, userId) => {
      const index = socketIds.indexOf(client.id);
      if (index !== -1) {
        socketIds.splice(index, 1);
        if (socketIds.length === 0) {
          this.userSocketMap.delete(userId);
        } else {
          this.userSocketMap.set(userId, socketIds);
        }
      }
    });
  }

  @SubscribeMessage('join')
  handleJoin(client: Socket, payload: { userId: number }) {
    const { userId } = payload;
    if (!userId) {
      this.logger.error('Join event received without userId');
      return;
    }

    this.logger.log(`User ${userId} joined with socket ${client.id}`);
    
    // Add client to user's socket list
    const userSockets = this.userSocketMap.get(userId) || [];
    if (!userSockets.includes(client.id)) {
      userSockets.push(client.id);
      this.userSocketMap.set(userId, userSockets);
    }

    // Join user's room
    client.join(`user_${userId}`);
  }

  sendNotificationToUser(userId: number, notification: any) {
    this.logger.log(`Sending notification to user ${userId}: ${JSON.stringify(notification)}`);
    
    // Send to user's room
    this.server.to(`user_${userId}`).emit('notification', notification);
  }

  sendNotificationToProvider(providerId: number, notification: any) {
    this.logger.log(`Sending notification to provider ${providerId}: ${JSON.stringify(notification)}`);
    
    // Send to provider's room
    this.server.to(`user_${providerId}`).emit('notification', notification);
  }
}