import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TrafficService } from './traffic.service';
import { Zone, TrafficLevel } from '../entities/zone.entity';
import { CreateZoneInput } from './dto/create-zone.input';

@Resolver(() => Zone)
export class TrafficResolver {
  constructor(private readonly trafficService: TrafficService) {}

  @Mutation(() => Zone)
  createZone(@Args('input') input: CreateZoneInput) {
    return this.trafficService.createZone(input);
  }

  @Query(() => [Zone])
  zones() {
    return this.trafficService.zones();
  }

  @Mutation(() => Zone)
  updateZoneDensity(
    @Args('id') id: string,
    @Args('level', { type: () => TrafficLevel }) level: TrafficLevel,
  ) {
    return this.trafficService.updateZoneDensity(id, level);
  }
}
