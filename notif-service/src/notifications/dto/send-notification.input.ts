import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class SendNotificationInput {
  @Field()
  title: string;

  @Field()
  message: string;

  @Field()
  userId: string;
}
