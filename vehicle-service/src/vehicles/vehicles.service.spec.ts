import { Test, TestingModule } from '@nestjs/testing';
import { VehiclesService } from './vehicles.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Vehicle, GpsPosition } from '../entities/vehicle.entity';
import { NotFoundException } from '@nestjs/common';

const mockVehicle = {
  id: 'uuid-veh-1',
  licensePlate: '16-1234-ALG',
  type: 'Bus',
  status: 'Actif',
  positions: [],
  createdAt: new Date(),
};

const mockPosition = {
  id: 'uuid-pos-1',
  vehicleId: 'uuid-veh-1',
  lat: 36.75,
  lng: 3.04,
  timestamp: new Date(),
};

const mockVehicleRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
};

const mockGpsRepo = {
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
};

describe('VehiclesService', () => {
  let service: VehiclesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VehiclesService,
        { provide: getRepositoryToken(Vehicle), useValue: mockVehicleRepo },
        { provide: getRepositoryToken(GpsPosition), useValue: mockGpsRepo },
      ],
    }).compile();

    service = module.get<VehiclesService>(VehiclesService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addVehicle()', () => {
    it('doit créer et retourner un véhicule', async () => {
      mockVehicleRepo.create.mockReturnValue(mockVehicle);
      mockVehicleRepo.save.mockResolvedValue(mockVehicle);

      const result = await service.addVehicle({
        licensePlate: '16-1234-ALG',
        type: 'Bus',
        status: 'Actif',
      });

      expect(result).toEqual(mockVehicle);
      expect(result.licensePlate).toBe('16-1234-ALG');
      expect(mockVehicleRepo.save).toHaveBeenCalledTimes(1);
    });
  });

  describe('vehicles()', () => {
    it('doit retourner tous les véhicules avec leurs positions', async () => {
      mockVehicleRepo.find.mockResolvedValue([mockVehicle]);

      const result = await service.vehicles();

      expect(result).toHaveLength(1);
      expect(result[0].licensePlate).toBe('16-1234-ALG');
      expect(mockVehicleRepo.find).toHaveBeenCalledWith({
        relations: { positions: true },
      });
    });
  });

  describe('vehicle()', () => {
    it('doit retourner un véhicule par son id', async () => {
      mockVehicleRepo.findOne.mockResolvedValue(mockVehicle);

      const result = await service.vehicle('uuid-veh-1');
      expect(result).toEqual(mockVehicle);
    });

    it('doit lever NotFoundException si véhicule inexistant', async () => {
      mockVehicleRepo.findOne.mockResolvedValue(null);
      await expect(service.vehicle('id-inexistant')).rejects.toThrow(NotFoundException);
    });
  });

  describe('recordPosition()', () => {
    it('doit enregistrer une nouvelle position GPS', async () => {
      mockVehicleRepo.findOne.mockResolvedValue(mockVehicle);
      mockGpsRepo.create.mockReturnValue(mockPosition);
      mockGpsRepo.save.mockResolvedValue(mockPosition);

      const result = await service.recordPosition({
        vehicleId: 'uuid-veh-1',
        lat: 36.75,
        lng: 3.04,
      });

      expect(result).toEqual(mockPosition);
      expect(result.lat).toBe(36.75);
      expect(mockGpsRepo.save).toHaveBeenCalledTimes(1);
    });

    it('doit lever NotFoundException si véhicule inexistant', async () => {
      mockVehicleRepo.findOne.mockResolvedValue(null);
      await expect(
        service.recordPosition({ vehicleId: 'bad-id', lat: 0, lng: 0 }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('vehicleHistory()', () => {
    it("doit retourner l'historique GPS d'un véhicule", async () => {
      mockGpsRepo.find.mockResolvedValue([mockPosition]);

      const result = await service.vehicleHistory('uuid-veh-1');
      expect(result).toHaveLength(1);
      expect(result[0].lat).toBe(36.75);
    });
  });
});
