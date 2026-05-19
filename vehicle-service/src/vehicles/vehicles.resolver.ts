// src/vehicles/vehicles.resolver.ts
@Resolver(() => Vehicle)
export class VehiclesResolver {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Mutation(() => Vehicle)
  @UseGuards(GqlAuthGuard)
  createVehicle(@Args('input') input: CreateVehicleInput): Promise<Vehicle> {
    return this.vehiclesService.create(input);
  }

  @Query(() => [Vehicle])
  @UseGuards(GqlAuthGuard)
  vehicles(): Promise<Vehicle[]> {
    return this.vehiclesService.findAll();
  }

  @Query(() => Vehicle)
  @UseGuards(GqlAuthGuard)
  vehicle(@Args('id') id: string): Promise<Vehicle> {
    return this.vehiclesService.findOne(id);
  }

  @Mutation(() => GpsPosition)
  @UseGuards(GqlAuthGuard)
  recordPosition(
    @Args('vehicleId') vehicleId: string,
    @Args('lat') lat: number,
    @Args('lng') lng: number,
    @Args('speed', { nullable: true }) speed?: number,
  ): Promise<GpsPosition> {
    return this.vehiclesService.recordPosition(vehicleId, lat, lng, speed);
  }

  @Query(() => [GpsPosition])
  @UseGuards(GqlAuthGuard)
  vehicleHistory(@Args('vehicleId') vehicleId: string): Promise<GpsPosition[]> {
    return this.vehiclesService.getHistory(vehicleId);
  }
}