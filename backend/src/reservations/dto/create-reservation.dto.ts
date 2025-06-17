import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
} from 'class-validator';

export class CreateReservationDto {
    @ApiProperty()
    @IsDateString()
    date: Date;

    @ApiProperty()
    @IsString()
    lieu: string;

    @ApiProperty()
    @IsString()
    time: string;

    @IsNumber()
    petId: number;

    @ApiProperty()
    @IsNumber()
    userId: number;

    @ApiProperty()
    @IsArray()
    @ArrayNotEmpty()
    serviceIds: number[]; 
}
