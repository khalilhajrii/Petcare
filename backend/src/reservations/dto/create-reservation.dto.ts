import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsDateString,
  IsNumber,
  IsArray,
  ArrayNotEmpty,
  Matches,
} from 'class-validator';

export class CreateReservationDto {
    @ApiProperty()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
      message: 'La date doit être au format YYYY-MM-DD',
    })
    date: Date;

    @ApiProperty()
    @IsString()
    lieu: string;

    @ApiProperty()
    @IsString()
    @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/)
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
