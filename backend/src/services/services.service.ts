import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Service } from './entities/service.entity';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}

  create(dto: CreateServiceDto) {
    const newService = this.serviceRepository.create(dto);
    return this.serviceRepository.save(newService);
  }

  findAll() {
    return this.serviceRepository.find();
  }

  async findOne(id: number) {
    const service = await this.serviceRepository.findOneBy({ idservice: id });
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }

  async update(id: number, dto: UpdateServiceDto) {
    await this.findOne(id); // Vérifie l'existence
    await this.serviceRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.serviceRepository.delete(id);
  }
}
