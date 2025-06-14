/*
https://docs.nestjs.com/controllers#controllers
*/

import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { PetsService } from './pet.service';
import { CreatePetDto } from 'src/dto/create-pet.dto';
import { Pet } from './entities/pet.entity';
import { UpdatePetDto } from 'src/dto/update-pet.dto';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Pets')
@Controller('pets')
export class PetsController { 
    constructor(private readonly petsService: PetsService) {}


    @Post()
    @ApiOperation({ summary: 'Create a new pet' })
    @ApiResponse({ status: 201, description: 'The pet has been successfully created.', type: Pet })
    @ApiResponse({ status: 400, description: 'Bad request.' })
    @ApiBody({ type: CreatePetDto })
    create(@Body() createPetDto: CreatePetDto): Promise<Pet> {
        return this.petsService.create(createPetDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all pets' })
    @ApiResponse({ status: 200, description: 'Return all pets.', type: [Pet] })
    findAll(): Promise<Pet[]> {
        return this.petsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a pet by ID' })
    @ApiResponse({ status: 200, description: 'Return the pet.', type: Pet })
    @ApiResponse({ status: 404, description: 'Pet not found.' })
    @ApiParam({ name: 'id', type: 'number', description: 'Pet ID' })
    findOne(@Param('id') id: string): Promise<Pet> {
        return this.petsService.findOne(+id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a pet' })
    @ApiResponse({ status: 200, description: 'The pet has been successfully updated.', type: Pet })
    @ApiResponse({ status: 404, description: 'Pet not found.' })
    @ApiParam({ name: 'id', type: 'number', description: 'Pet ID' })
    @ApiBody({ type: UpdatePetDto })
    update(@Param('id') id: string, @Body() updatePetDto: UpdatePetDto): Promise<Pet> {
        return this.petsService.update(+id, updatePetDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a pet' })
    @ApiResponse({ status: 200, description: 'The pet has been successfully deleted.' })
    @ApiResponse({ status: 404, description: 'Pet not found.' })
    @ApiParam({ name: 'id', type: 'number', description: 'Pet ID' })
    remove(@Param('id') id: string): Promise<void> {
        return this.petsService.remove(+id);
    }

    @Get('user/:userId')
    @ApiOperation({ summary: 'Get pets by user ID' })
    @ApiResponse({ status: 200, description: 'Return pets for the specified user.', type: [Pet] })
    @ApiParam({ name: 'userId', type: 'number', description: 'User ID' })
    findByUser(@Param('userId') userId: string): Promise<Pet[]> {
        return this.petsService.findByUser(+userId);
    }
}