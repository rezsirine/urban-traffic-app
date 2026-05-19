import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { IncidentsService } from './incidents.service';
import { Incident, IncidentStatus } from '../entities/incident.entity';
import { DeclareIncidentInput } from './dto/declare-incident.input';

@Resolver(() => Incident)
export class IncidentsResolver {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Mutation(() => Incident)
  declareIncident(@Args('input') input: DeclareIncidentInput) {
    return this.incidentsService.declareIncident(input);
  }

  @Query(() => [Incident])
  incidents() {
    return this.incidentsService.incidents();
  }

  @Mutation(() => Incident)
  updateIncidentStatus(
    @Args('id') id: string,
    @Args('status', { type: () => IncidentStatus }) status: IncidentStatus,
  ) {
    return this.incidentsService.updateIncidentStatus(id, status);
  }
}
