import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehicle, GpsPosition } from '../entities/vehicle.entity';
import { AddVehicleInput } from './dto/add-vehicle.input';
import { RecordPositionInput } from './dto/record-position.input';

@Injectable()
export class VehiclesService {
  constructor(
    @InjectRepository(Vehicle) private vehicleRepo: Repository<Vehicle>,
    @InjectRepository(GpsPosition) private gpsRepo: Repository<GpsPosition>,
  ) {}

  async addVehicle(input: AddVehicleInput): Promise<Vehicle> {
    const vehicle = this.vehicleRepo.create(input);
    return this.vehicleRepo.save(vehicle);
  }

  async vehicles(): Promise<Vehicle[]> {
    return this.vehicleRepo.find({ relations: { positions: true } });
  }

  async vehicle(id: string): Promise<Vehicle> {
    const vehicle = await this.vehicleRepo.findOne({
      where: { id },
      relations: { positions: true },
    });
    if (!vehicle) throw new NotFoundException('Vehicle not found');
    return vehicle;
  }

  async recordPosition(input: RecordPositionInput): Promise<GpsPosition> {
    const vehicle = await this.vehicleRepo.findOne({ where: { id: input.vehicleId } });
    if (!vehicle) throw new NotFoundException('Vehicle not found');

    const pos = this.gpsRepo.create({
      lat: input.lat,
      lng: input.lng,
      vehicleId: input.vehicleId,
    });
    return this.gpsRepo.save(pos);
  }

  async vehicleHistory(vehicleId: string): Promise<GpsPosition[]> {
    return this.gpsRepo.find({
      where: { vehicleId },
      order: { timestamp: 'DESC' },
    });
  }
}
