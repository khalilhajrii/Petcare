import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateReservationDto {
  @ApiPropertyOptional({ example: '2025-07-20' })
  date?: Date;

  @ApiPropertyOptional({ example: '09:00' })
  time?: string;

  @ApiPropertyOptional({ example: 'Bardo' })
  lieu?: string;

  @ApiPropertyOptional({ example: 3 })
  userId?: number;

  @ApiPropertyOptional({ example: 1 })
  petId?: number;

  @ApiPropertyOptional({ example: [1, 2] })
  serviceIds?: number[];
}
