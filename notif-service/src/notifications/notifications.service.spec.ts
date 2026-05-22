import { Test, TestingModule } from '@nestjs/testing';
import { NotificationsService } from './notifications.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Notification } from '../entities/notification.entity';
import { NotFoundException } from '@nestjs/common';
import { NotificationsGateway } from './notifications.gateway';

const mockNotif = {
  id: 'uuid-notif-1',
  userId: 'Admin',
  title: 'Alerte Rouge',
  message: 'Accident signalé sur autoroute Est',
  isRead: false,
  createdAt: new Date(),
};

const mockNotifRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockGateway = {
  server: {
    emit: jest.fn(),
  },
};

describe('NotificationsService', () => {
  let service: NotificationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationsService,
        { provide: getRepositoryToken(Notification), useValue: mockNotifRepo },
        { provide: NotificationsGateway, useValue: mockGateway },
      ],
    }).compile();

    service = module.get<NotificationsService>(NotificationsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('sendNotification()', () => {
    it('doit créer et retourner une notification et émettre un événement', async () => {
      mockNotifRepo.create.mockReturnValue(mockNotif);
      mockNotifRepo.save.mockResolvedValue(mockNotif);

      const result = await service.sendNotification({
        userId: 'Admin',
        title: 'Alerte Rouge',
        message: 'Accident signalé sur autoroute Est',
      });

      expect(result).toEqual(mockNotif);
      expect(result.isRead).toBe(false);
      expect(mockNotifRepo.save).toHaveBeenCalledTimes(1);
      expect(mockGateway.server.emit).toHaveBeenCalledWith('notification_Admin', mockNotif);
    });
  });

  describe('notifications()', () => {
    it('doit retourner les notifications d\'un utilisateur', async () => {
      mockNotifRepo.find.mockResolvedValue([mockNotif]);

      const result = await service.notifications('Admin');

      expect(result).toHaveLength(1);
      expect(result[0].userId).toBe('Admin');
      expect(mockNotifRepo.find).toHaveBeenCalledWith({
        where: { userId: 'Admin' },
        order: { createdAt: 'DESC' },
      });
    });

    it('doit retourner un tableau vide si aucune notification', async () => {
      mockNotifRepo.find.mockResolvedValue([]);
      const result = await service.notifications('UserInexistant');
      expect(result).toHaveLength(0);
    });
  });

  describe('markAsRead()', () => {
    it('doit marquer une notification comme lue', async () => {
      const readNotif = { ...mockNotif, isRead: true };
      mockNotifRepo.findOne.mockResolvedValue({ ...mockNotif });
      mockNotifRepo.save.mockResolvedValue(readNotif);

      const result = await service.markAsRead('uuid-notif-1');

      expect(result.isRead).toBe(true);
      expect(mockNotifRepo.save).toHaveBeenCalledTimes(1);
    });

    it('doit lever NotFoundException si notification inexistante', async () => {
      mockNotifRepo.findOne.mockResolvedValue(null);

      await expect(service.markAsRead('id-inexistant')).rejects.toThrow(NotFoundException);
    });
  });
});
