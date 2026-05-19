// src/traffic/entities/zone.entity.ts
export enum TrafficLevel { LOW = 'LOW', MEDIUM = 'MEDIUM', HIGH = 'HIGH' }
registerEnumType(TrafficLevel, { name: 'TrafficLevel' });

@ObjectType()
@Entity('zones')
export class TrafficZone {
  @Field(() => ID) @PrimaryGeneratedColumn('uuid') id: string;
  @Field() @Column() name: string;
  @Field() @Column('decimal') centerLat: number;
  @Field() @Column('decimal') centerLng: number;
  @Field() @Column('decimal') radiusKm: number;        // rayon en km
  @Field(() => Int) @Column({ default: 0 }) vehicleCount: number;
  @Field(() => TrafficLevel)
  @Column({ type: 'enum', enum: TrafficLevel, default: TrafficLevel.LOW })
  level: TrafficLevel;
  @Field() @UpdateDateColumn() updatedAt: Date;
}