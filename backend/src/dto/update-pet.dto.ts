import { PartialType } from '@nestjs/mapped-types';
import { CreatePetDto } from './create-pet.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePetDto extends PartialType(CreatePetDto) {
    @ApiProperty({ example: 'Fluffy', description: 'The name of the pet', required: false })
    nom?: string;

    @ApiProperty({ example: 'Cat', description: 'The type of pet', required: false })
    type?: string;

    @ApiProperty({ example: 3, description: 'The age of the pet', required: false })
    age?: number;

    @ApiProperty({ example: 'Persian', description: 'The breed of the pet', required: false })
    race?: string;

    @ApiProperty({ example: 1, description: 'The ID of the user who owns the pet', required: false })
    userId?: number;
    }