import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';

export enum IncidentType {
  ACCIDENT = 'ACCIDENT',
  TRAVAUX = 'TRAVAUX',
  ROUTE_FERMEE = 'ROUTE_FERMEE',
  EMBOUTEILLAGE = 'EMBOUTEILLAGE',
}
registerEnumType(IncidentType, { name: 'IncidentType' });

export enum IncidentStatus {
  SIGNALE = 'SIGNALE',
  EN_COURS = 'EN_COURS',
  RESOLU = 'RESOLU',
}
registerEnumType(IncidentStatus, { name: 'IncidentStatus' });

@ObjectType()
@Entity('incidents')
export class Incident {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  description: string;

  @Field(() => IncidentType)
  @Column({ type: 'enum', enum: IncidentType })
  type: IncidentType;

  @Field(() => IncidentStatus)
  @Column({ type: 'enum', enum: IncidentStatus, default: IncidentStatus.SIGNALE })
  status: IncidentStatus;

  @Field()
  @Column('decimal', { precision: 10, scale: 7 })
  lat: number;

  @Field()
  @Column('decimal', { precision: 10, scale: 7 })
  lng: number;

  @Field()
  @Column()
  reportedBy: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;
}
