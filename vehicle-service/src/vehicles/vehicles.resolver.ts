import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { VehiclesService } from './vehicles.service';
import { Vehicle, GpsPosition } from '../entities/vehicle.entity';
import { AddVehicleInput } from './dto/add-vehicle.input';
import { RecordPositionInput } from './dto/record-position.input';

@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Mutation(() => Vehicle)
  addVehicle(@Args('input') input: AddVehicleInput) {
    return this.vehiclesService.addVehicle(input);
  }

  @Query(() => [Vehicle])
  vehicles() {
    return this.vehiclesService.vehicles();
  }

  @Query(() => Vehicle)
  vehicle(@Args('id') id: string) {
    return this.vehiclesService.vehicle(id);
  }

  @Mutation(() => GpsPosition)
  recordPosition(@Args('input') input: RecordPositionInput) {
    return this.vehiclesService.recordPosition(input);
  }

  @Query(() => [GpsPosition])
  vehicleHistory(@Args('vehicleId') vehicleId: string) {
    return this.vehiclesService.vehicleHistory(vehicleId);
  }
}