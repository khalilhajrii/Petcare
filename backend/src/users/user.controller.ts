import {
  Controller,
  Get,
  Param,
  UseGuards,
  Request,
  Patch,
  Body,
  Delete,
  Put,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User')
// @ApiBearerAuth()
@Controller('users')
// @UseGuards(JwtAuthGuard, RolesGuard) // apply JWT auth globally to this controller
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // Admin: get all users
  @Get()
  // @Roles('admin') // seule l'admin peut voir tous les utilisateurs
  async ListUsers() {
    return this.userService.findAll();
  }
  
  // Get current user profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async GetUserProfile(@Request() req) {
    return this.userService.findOne(req.user.id);
  }
  
  // Update current user profile
  @Put('profile')
  @UseGuards(JwtAuthGuard)
  async UpdateUserProfile(@Request() req, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(req.user.id, updateUserDto);
  }

  // Patch c'est pour mettre à jour un utilisateur
  @Patch(':id')
  async UpdateUser(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  //Get user by ID
  @Get(':id')
  async GetUserById(@Param('id') id: number) {
    return this.userService.findOne(+id);
  }

  // Delete user by ID
  @Delete(':id')
  async RemoveUser(@Param('id') id: number) {
    return this.userService.remove(+id);
  }


}
