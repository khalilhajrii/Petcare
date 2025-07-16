import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
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
  
  // Méthodes pour les prestataires
  async findByUserId(userId: number) {
    return this.serviceRepository.find({
      where: { userId },
      relations: ['user'],
    });
  }
  
  async findOneByUser(id: number, userId: number) {
    const service = await this.serviceRepository.findOne({
      where: { idservice: id, userId },
      relations: ['user'],
    });
    
    if (!service) throw new NotFoundException('Service not found');
    return service;
  }
  
  async updateByUser(id: number, userId: number, dto: UpdateServiceDto) {
    const service = await this.serviceRepository.findOne({
      where: { idservice: id },
    });
    
    if (!service) throw new NotFoundException('Service not found');
    if (service.userId !== userId) throw new ForbiddenException('You do not have permission to update this service');
    
    await this.serviceRepository.update(id, dto);
    return this.findOneByUser(id, userId);
  }
  
  async removeByUser(id: number, userId: number) {
    const service = await this.serviceRepository.findOne({
      where: { idservice: id },
    });
    
    if (!service) throw new NotFoundException('Service not found');
    if (service.userId !== userId) throw new ForbiddenException('You do not have permission to delete this service');
    
    return this.serviceRepository.delete(id);
  }
}
