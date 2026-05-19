import { InputType, Field } from '@nestjs/graphql';
import { IncidentType } from '../../entities/incident.entity';

@InputType()
export class DeclareIncidentInput {
  @Field()
  description: string;

  @Field(() => IncidentType)
  type: IncidentType;

  @Field()
  lat: number;

  @Field()
  lng: number;

  @Field()
  reportedBy: string; // the user ID
}
