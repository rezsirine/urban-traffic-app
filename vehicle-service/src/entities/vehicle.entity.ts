import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
@Entity('vehicles')
export class Vehicle {
  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id: string;
  @Field() @Column() licensePlate: string;
  @Field() @Column() type: string; // e.g. Car, Truck, Bus
  @Field() @Column() status: string; // e.g. Active, Inactive

  @Field(() => [GpsPosition], { nullable: true })
  @OneToMany(() => GpsPosition, pos => pos.vehicle)
  positions: GpsPosition[];

  @Field() @CreateDateColumn() createdAt: Date;
}

@ObjectType()
@Entity('gps_positions')
export class GpsPosition {
  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id: string;
  
  @Field() @Column('decimal', { precision: 10, scale: 7 }) lat: number;
  @Field() @Column('decimal', { precision: 10, scale: 7 }) lng: number;
  
  @Field() @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' }) timestamp: Date;
  
  @ManyToOne(() => Vehicle, v => v.positions)
  vehicle: Vehicle;
  
  @Column() vehicleId: string;
}