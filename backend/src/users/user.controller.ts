import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserDto } from './dto/updateuser.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
// @ApiBearerAuth()
@Controller('users')
// @UseGuards(JwtAuthGuard) // apply JWT auth globally to this controller
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // Admin: get all users
  @Get()
  // @Roles('admin') // seule l'admin peut voir tous les utilisateurs
  findAll() {
    return this.userService.findAll();
  }



}
