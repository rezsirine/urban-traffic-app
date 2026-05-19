import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  ADMIN = 'ADMIN',
  OPERATOR = 'OPERATOR',
}
registerEnumType(UserRole, { name: 'UserRole' });

@ObjectType()
@Entity('users')
export class User {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Column()
  password: string; // hashé, pas exposé GraphQL

  @Field()
  @Column()
  name: string;

  @Field(() => UserRole)
  @Column({ type: 'enum', enum: UserRole, default: UserRole.OPERATOR })
  role: UserRole;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}