import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVaccinationRecordDto {
  @ApiProperty({ example: 'Rabies Vaccine', description: 'Name of the vaccine' })
  @IsString()
  @IsNotEmpty()
  nomVaccin: string;

  @ApiProperty({ example: '2023-05-15', description: 'Date of vaccination' })
  @IsDateString()
  @IsNotEmpty()
  dateVaccination: Date;

  @ApiProperty({ example: 'Dr. Smith', description: 'Name of the veterinarian' })
  @IsString()
  @IsNotEmpty()
  veterinaire: string;

  @ApiProperty({ example: 1, description: 'ID of the pet' })
  @IsNumber()
  @IsNotEmpty()
  petId: number;
}