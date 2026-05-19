import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RecordPositionInput {
  @Field()
  vehicleId: string;

  @Field()
  lat: number;

  @Field()
  lng: number;
}
