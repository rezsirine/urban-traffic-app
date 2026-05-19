import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrafficService } from './traffic.service';
import { TrafficResolver } from './traffic.resolver';
import { Zone } from '../entities/zone.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Zone])],
  providers: [TrafficService, TrafficResolver],
  exports: [TrafficService],
})
export class TrafficModule {}
