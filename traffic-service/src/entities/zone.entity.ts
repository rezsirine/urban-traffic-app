import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

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

  @Field()
  @Column('json')
  bounds: string; // Storing as JSON string of coordinates for simplicity

  @Field(() => TrafficLevel)
  @Column({ type: 'enum', enum: TrafficLevel, default: TrafficLevel.FAIBLE })
  densityLevel: TrafficLevel;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
