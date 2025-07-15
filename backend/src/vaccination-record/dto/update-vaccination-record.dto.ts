import { PartialType } from '@nestjs/mapped-types';
import { CreateVaccinationRecordDto } from './create-vaccination-record.dto';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateVaccinationRecordDto extends PartialType(CreateVaccinationRecordDto) {
  @ApiProperty({ example: 'Rabies Vaccine', description: 'Name of the vaccine', required: false })
  nomVaccin?: string;

  @ApiProperty({ example: '2023-05-15', description: 'Date of vaccination', required: false })
  dateVaccination?: Date;

  @ApiProperty({ example: 'Dr. Smith', description: 'Name of the veterinarian', required: false })
  veterinaire?: string;

  @ApiProperty({ example: 1, description: 'ID of the pet', required: false })
  petId?: number;
}