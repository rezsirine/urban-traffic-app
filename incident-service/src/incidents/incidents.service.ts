import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Incident, IncidentStatus } from '../entities/incident.entity';
import { DeclareIncidentInput } from './dto/declare-incident.input';

@Injectable()
export class IncidentsService {
  constructor(
    @InjectRepository(Incident) private incidentRepo: Repository<Incident>,
  ) {}

  async declareIncident(input: DeclareIncidentInput): Promise<Incident> {
    const incident = this.incidentRepo.create(input);
    return this.incidentRepo.save(incident);
  }

  async incidents(): Promise<Incident[]> {
    return this.incidentRepo.find({ order: { createdAt: 'DESC' } });
  }

  async updateIncidentStatus(id: string, status: IncidentStatus): Promise<Incident> {
    const incident = await this.incidentRepo.findOne({ where: { id } });
    if (!incident) throw new NotFoundException('Incident not found');

    incident.status = status;
    return this.incidentRepo.save(incident);
  }
}
