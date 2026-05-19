import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone, TrafficLevel } from '../entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';

@Injectable()
export class TrafficService {
  constructor(
    @InjectRepository(Zone) private zoneRepo: Repository<Zone>,
  ) {}

  async createZone(input: CreateZoneInput): Promise<Zone> {
    const zone = this.zoneRepo.create(input);
    return this.zoneRepo.save(zone);
  }

  async zones(): Promise<Zone[]> {
    return this.zoneRepo.find();
  }

  async updateZoneDensity(id: string, level: TrafficLevel): Promise<Zone> {
    const zone = await this.zoneRepo.findOne({ where: { id } });
    if (!zone) throw new NotFoundException('Zone not found');

    zone.densityLevel = level;
    return this.zoneRepo.save(zone);
  }
}
