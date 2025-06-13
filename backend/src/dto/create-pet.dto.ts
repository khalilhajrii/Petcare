import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsNotEmpty } from 'class-validator';

export class CreatePetDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Fluffy', description: 'The name of the pet' })
  nom: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Cat', description: 'The type of pet' })
  type: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 3, description: 'The age of the pet' })
  age: number;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Persian', description: 'The breed of the pet' })
  race: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 1, description: 'The ID of the user who owns the pet' })
  userId: number;
}