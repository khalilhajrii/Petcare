import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';


export class CreateServiceDto {
    @ApiProperty()
    @IsString()
    nomservice: string;

    @ApiProperty()
    @IsNumber()
    prixService: number;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsString()
    servicedetail: string;
}
