import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';

@InputType()
export class RegisterInput {
  @Field() @IsEmail() email: string;
  @Field() name: string;
  @Field() @MinLength(8) password: string;
  @Field(() => UserRole, { nullable: true })
  @IsOptional() @IsEnum(UserRole)
  role?: UserRole;
}