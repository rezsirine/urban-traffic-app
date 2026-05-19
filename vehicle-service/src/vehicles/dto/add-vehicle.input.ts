import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class AddVehicleInput {
  @Field()
  licensePlate: string;

  @Field()
  type: string;

  @Field()
  status: string;
}
