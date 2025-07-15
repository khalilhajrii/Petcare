import { Controller, Post, Get} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from '../users/entities/role.entity';
import { Repository } from 'typeorm';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Role') 
@Controller('roles')
export class RoleController {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  @Post('init')
  async initializeRoles() {
    const count = await this.roleRepository.count();
    if (count > 0) {
      return { message: 'Roles already exist' };
    }

    const roles = ['admin', 'client', 'prestataire'].map((roleName) =>
      this.roleRepository.create({ roleName }),
    );

    await this.roleRepository.save(roles);
    return { message: 'Roles created successfully' };
  }

  @Get()
  async getAllRoles(): Promise<Role[]> {
    return this.roleRepository.find();
  }
}
