import { Test, TestingModule } from '@nestjs/testing';
import { TrafficService } from './traffic.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Zone, TrafficLevel } from '../entities/zone.entity';
import { NotFoundException } from '@nestjs/common';

const mockZone = {
  id: 'uuid-zone-1',
  name: 'Centre-Ville',
  bounds: [[36.77, 3.05], [36.77, 3.06], [36.76, 3.06], [36.76, 3.05]],
  densityLevel: TrafficLevel.MOYEN,
  createdAt: new Date(),
};

const mockZoneRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

describe('TrafficService', () => {
  let service: TrafficService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrafficService,
        { provide: getRepositoryToken(Zone), useValue: mockZoneRepo },
      ],
    }).compile();

    service = module.get<TrafficService>(TrafficService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createZone()', () => {
    it('doit créer et retourner une zone', async () => {
      mockZoneRepo.create.mockReturnValue(mockZone);
      mockZoneRepo.save.mockResolvedValue(mockZone);

      const result = await service.createZone({
        name: 'Centre-Ville',
        bounds: [[36.77, 3.05], [36.77, 3.06]],
        densityLevel: TrafficLevel.MOYEN,
      });

      expect(result).toEqual(mockZone);
      expect(result.name).toBe('Centre-Ville');
      expect(mockZoneRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('zones()', () => {
    it('doit retourner la liste de toutes les zones', async () => {
      mockZoneRepo.find.mockResolvedValue([mockZone]);

      const result = await service.zones();

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Centre-Ville');
      expect(result[0].densityLevel).toBe(TrafficLevel.MOYEN);
    });

    it('doit retourner un tableau vide si aucune zone', async () => {
      mockZoneRepo.find.mockResolvedValue([]);
      const result = await service.zones();
      expect(result).toHaveLength(0);
    });
  });

  describe('updateZoneDensity()', () => {
    it('doit mettre à jour le niveau de densité d\'une zone', async () => {
      const updatedZone = { ...mockZone, densityLevel: TrafficLevel.ELEVE };
      mockZoneRepo.findOne.mockResolvedValue({ ...mockZone });
      mockZoneRepo.save.mockResolvedValue(updatedZone);

      const result = await service.updateZoneDensity('uuid-zone-1', TrafficLevel.ELEVE);

      expect(result.densityLevel).toBe(TrafficLevel.ELEVE);
      expect(mockZoneRepo.save).toHaveBeenCalledTimes(1);
    });

    it('doit lever NotFoundException si zone inexistante', async () => {
      mockZoneRepo.findOne.mockResolvedValue(null);

      await expect(
        service.updateZoneDensity('id-inexistant', TrafficLevel.ELEVE),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
