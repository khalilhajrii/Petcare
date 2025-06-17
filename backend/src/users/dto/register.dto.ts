import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @ApiProperty()
  firstName: string;
  
  @ApiProperty()
  lastName: string;
  
  @ApiProperty()
  @IsEmail()
  email: string;
  
  @ApiProperty()
  @MinLength(6)
  password: string;
  
  @ApiProperty()
  phone?: string;
  
  @ApiProperty()
  address: string;

  @ApiProperty()
  roleId: number;
}
