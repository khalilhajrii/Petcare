import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty()
  firstName: string;
  
  @ApiProperty()
  lastName: string;
  
  @ApiProperty()
  email: string;
  
  @ApiProperty()
  password: string;
  
  @ApiProperty()
  phone?: string;
  
  @ApiProperty()
  address: string;

  @ApiProperty()
  roleId: number;
}
