import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VehiclesService } from './vehicles.service';
import { VehiclesResolver } from './vehicles.resolver';
import { Vehicle, GpsPosition } from '../entities/vehicle.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vehicle, GpsPosition])],
  providers: [VehiclesService, VehiclesResolver],
  exports: [VehiclesService],
})
export class VehiclesModule {}
