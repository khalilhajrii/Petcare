/*
https://docs.nestjs.com/providers#services
*/

import { Injectable, NotFoundException } from '@nestjs/common';

import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { CreatePetDto } from 'src/pets/dto/create-pet.dto';
import { UpdatePetDto } from 'src/pets/dto/update-pet.dto';
import { Pet } from './entities/pet.entity';

@Injectable()
export class PetsService { 
    constructor(
        @InjectRepository(Pet)
        private petsRepository: Repository<Pet>,
    ) {}

    async create(createPetDto: CreatePetDto): Promise<Pet> {
        const pet = this.petsRepository.create(createPetDto);
        return await this.petsRepository.save(pet);
    }

    async findAll(): Promise<Pet[]> {
        return await this.petsRepository.find({ relations: ['user', 'vaccinationRecords', 'reservations'] });
    }

    async findOne(id: number): Promise<Pet> {
    const pet = await this.petsRepository.findOne({
        where: { idPet: id },
        relations: ['user', 'vaccinationRecords', 'reservations'],
    });
    if (!pet) {
        throw new NotFoundException(`Pet with ID ${id} not found`);
    }
    return pet;
    }

    async update(id: number, updatePetDto: UpdatePetDto): Promise<Pet> {
    const pet = await this.findOne(id);
    this.petsRepository.merge(pet, updatePetDto);
    return await this.petsRepository.save(pet);
    }

    async remove(id: number): Promise<void> {
    const pet = await this.findOne(id);
    await this.petsRepository.remove(pet);
    }

    async findByUser(userId: number): Promise<Pet[]> {
    return await this.petsRepository.find({
        where: { userId },
        relations: ['vaccinationRecords', 'reservations'],
    });
    }

    async findByUserWithVaccinations(userId: number): Promise<Pet[]> {
        const pets = await this.petsRepository.find({
            where: { userId },
            relations: ['vaccinationRecords'],
        });
        
        // Ensure vaccination records are loaded and properly initialized
        return pets.map(pet => {
            if (!pet.vaccinationRecords) {
                pet.vaccinationRecords = [];
            }
            return pet;
        });
    }
}
