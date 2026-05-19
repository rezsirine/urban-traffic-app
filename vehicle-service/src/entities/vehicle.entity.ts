// src/vehicles/entities/vehicle.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { GpsPosition } from './gps-position.entity';

@ObjectType()
@Entity('vehicles')
export class Vehicle {
  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id: string;
  @Field() @Column() plate: string;            // immatriculation
  @Field() @Column() brand: string;
  @Field() @Column() model: string;
  @Field() @Column({ nullable: true }) driverId: string;
  @Field(() => [GpsPosition], { nullable: true })
  @OneToMany(() => GpsPosition, pos => pos.vehicle)
  positions: GpsPosition[];
  @Field() @CreateDateColumn() createdAt: Date;
}

// src/vehicles/entities/gps-position.entity.ts
@ObjectType()
@Entity('gps_positions')
export class GpsPosition {
  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id: string;
  @Field() @Column('decimal', { precision: 10, scale: 7 }) latitude: number;
  @Field() @Column('decimal', { precision: 10, scale: 7 }) longitude: number;
  @Field() @Column({ nullable: true }) speed: number;    // km/h
  @Field() @Column({ type: 'timestamp', default: () => 'NOW()' }) recordedAt: Date;
  @ManyToOne(() => Vehicle, v => v.positions)
  vehicle: Vehicle;
  @Column() vehicleId: string;
}