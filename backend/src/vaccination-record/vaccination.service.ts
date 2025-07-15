import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { VaccinationRecord } from "./entities/vaccination-record.entity";
import { Repository } from "typeorm";
import { Pet } from "src/pets/entities/pet.entity";
import { CreateVaccinationRecordDto } from "./dto/create-vaccination-record.dto";
import { UpdateVaccinationRecordDto } from "./dto/update-vaccination-record.dto";

@Injectable()
export class VaccinationRecordsService {
  constructor(
    @InjectRepository(VaccinationRecord)
    private readonly vaccinationRecordRepository: Repository<VaccinationRecord>,
    @InjectRepository(Pet)
    private readonly petRepository: Repository<Pet>,
  ) {}
  
 async create(createVaccinationRecordDto: CreateVaccinationRecordDto): Promise<VaccinationRecord> {
    const pet = await this.petRepository.findOne({
      where: { idPet: createVaccinationRecordDto.petId }
    });
    
    if (!pet) {
      throw new NotFoundException(`Pet with ID ${createVaccinationRecordDto.petId} not found`);
    }

    const record = this.vaccinationRecordRepository.create({
      ...createVaccinationRecordDto,
      pet
    });

    return await this.vaccinationRecordRepository.save(record);
  }

  async findAll(): Promise<VaccinationRecord[]> {
    return await this.vaccinationRecordRepository.find({ relations: ['pet'] });
  }


  async findOne(id: number): Promise<VaccinationRecord> {
    const record = await this.vaccinationRecordRepository.findOne({
      where: { id },
      relations: ['pet']
    });

    if (!record) {
      throw new NotFoundException(`Vaccination record with ID ${id} not found`);
    }

    return record;
  }

   async update(id: number, updateVaccinationRecordDto: UpdateVaccinationRecordDto): Promise<VaccinationRecord> {
    const record = await this.findOne(id);
    
    if (updateVaccinationRecordDto.petId) {
      const pet = await this.petRepository.findOne({
        where: { idPet: updateVaccinationRecordDto.petId }
      });
      
      if (!pet) {
        throw new NotFoundException(`Pet with ID ${updateVaccinationRecordDto.petId} not found`);
      }
      record.pet = pet;
    }

    this.vaccinationRecordRepository.merge(record, updateVaccinationRecordDto);
    return await this.vaccinationRecordRepository.save(record);
  }

   async remove(id: number): Promise<void> {
    const record = await this.findOne(id);
    await this.vaccinationRecordRepository.remove(record);
  }


    async findByPet(petId: number): Promise<VaccinationRecord[]> {
        const pet = await this.petRepository.findOne({
        where: { idPet: petId },
        relations: ['vaccinationRecords']
        });
    
        if (!pet) {
        throw new NotFoundException(`Pet with ID ${petId} not found`);
        }
    
        return pet.vaccinationRecords;
    }



}