import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';

export enum TrafficLevel {
  FAIBLE = 'FAIBLE',
  MOYEN = 'MOYEN',
  ELEVE = 'ELEVE',
}

registerEnumType(TrafficLevel, { name: 'TrafficLevel' });

@ObjectType()
@Entity('zones')
export class Zone {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

  @Field(() => GraphQLJSON)
  @Column('json')
  bounds: any; // Store as JSON array of coordinates

  @Field(() => TrafficLevel)
  @Column({ type: 'enum', enum: TrafficLevel, default: TrafficLevel.FAIBLE })
  densityLevel: TrafficLevel;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
