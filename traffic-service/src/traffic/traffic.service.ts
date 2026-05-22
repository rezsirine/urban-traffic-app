import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Zone, TrafficLevel } from '../entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';

@Injectable()
export class TrafficService implements OnModuleInit {
  constructor(
    @InjectRepository(Zone) private zoneRepo: Repository<Zone>,
  ) {}

  async onModuleInit() {
    const count = await this.zoneRepo.count();
    if (count === 0) {
      console.log('Seeding initial zones for Tunis...');
      await this.zoneRepo.save([
        { name: 'Centre-Ville', bounds: '[[36.81, 10.17], [36.81, 10.19], [36.80, 10.19], [36.80, 10.17]]', densityLevel: TrafficLevel.MOYEN },
        { name: 'Carthage', bounds: '[[36.86, 10.32], [36.86, 10.34], [36.84, 10.34], [36.84, 10.32]]', densityLevel: TrafficLevel.ELEVE },
        { name: 'La Marsa', bounds: '[[36.89, 10.32], [36.89, 10.34], [36.87, 10.34], [36.87, 10.32]]', densityLevel: TrafficLevel.FAIBLE },
      ]);
    }

    // Dynamic Density Simulation for Demo purposes (updates every 10s)
    setInterval(async () => {
      try {
        const zones = await this.zoneRepo.find();
        for (const zone of zones) {
          // 30% chance to change density level
          if (Math.random() > 0.7) {
            const levels = [TrafficLevel.FAIBLE, TrafficLevel.MOYEN, TrafficLevel.ELEVE];
            const newLevel = levels[Math.floor(Math.random() * levels.length)];
            if (zone.densityLevel !== newLevel) {
              zone.densityLevel = newLevel;
              await this.zoneRepo.save(zone);
            }
          }
        }
      } catch (err) {}
    }, 10000);
  }

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
