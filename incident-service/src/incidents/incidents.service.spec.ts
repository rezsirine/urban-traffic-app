import { Test, TestingModule } from '@nestjs/testing';
import { IncidentsService } from './incidents.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Incident, IncidentStatus } from '../entities/incident.entity';
import { NotFoundException } from '@nestjs/common';

const mockIncident = {
  id: 'uuid-inc-1',
  type: 'ACCIDENT',
  description: 'Accident grave sur autoroute Est',
  lat: 36.7,
  lng: 3.1,
  reportedBy: 'Admin',
  status: IncidentStatus.SIGNALE,
  createdAt: new Date(),
};

const mockIncidentRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('IncidentsService', () => {
  let service: IncidentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        IncidentsService,
        { provide: getRepositoryToken(Incident), useValue: mockIncidentRepo },
      ],
    }).compile();

    service = module.get<IncidentsService>(IncidentsService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('declareIncident()', () => {
    it('doit créer et sauvegarder un incident', async () => {
      mockIncidentRepo.create.mockReturnValue(mockIncident);
      mockIncidentRepo.save.mockResolvedValue(mockIncident);

      const result = await service.declareIncident({
        type: 'ACCIDENT',
        description: 'Accident grave sur autoroute Est',
        lat: 36.7,
        lng: 3.1,
        reportedBy: 'Admin',
      });

      expect(result).toEqual(mockIncident);
      expect(mockIncidentRepo.create).toHaveBeenCalledTimes(1);
      expect(mockIncidentRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('incidents()', () => {
    it('doit retourner la liste de tous les incidents', async () => {
      mockIncidentRepo.find.mockResolvedValue([mockIncident]);

      const result = await service.incidents();

      expect(result).toHaveLength(1);
      expect(result[0].type).toBe('ACCIDENT');
      expect(mockIncidentRepo.find).toHaveBeenCalledWith({
        order: { createdAt: 'DESC' },
      });
    });

    it('doit retourner un tableau vide si aucun incident', async () => {
      mockIncidentRepo.find.mockResolvedValue([]);
      const result = await service.incidents();
      expect(result).toHaveLength(0);
    });
  });

  describe('updateIncidentStatus()', () => {
    it('doit mettre à jour le statut d\'un incident', async () => {
      const updatedIncident = { ...mockIncident, status: IncidentStatus.EN_COURS };
      mockIncidentRepo.findOne.mockResolvedValue({ ...mockIncident });
      mockIncidentRepo.save.mockResolvedValue(updatedIncident);

      const result = await service.updateIncidentStatus('uuid-inc-1', IncidentStatus.EN_COURS);

      expect(result.status).toBe(IncidentStatus.EN_COURS);
      expect(mockIncidentRepo.save).toHaveBeenCalledTimes(1);
    });

    it('doit lever NotFoundException si incident inexistant', async () => {
      mockIncidentRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateIncidentStatus('id-inexistant', IncidentStatus.RESOLU),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
