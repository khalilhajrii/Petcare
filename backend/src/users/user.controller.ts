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


@Controller('users')
@UseGuards(JwtAuthGuard) // apply JWT auth globally to this controller
export class UserController {
  constructor(private readonly userService: UsersService) {}

  // Get current logged-in user info
  @Get('me')
  getMe(@Request() req) {
    return this.userService.findOne(req.user.sub);
  }

  // Update current user
  @Patch('me')
  updateMe(@Request() req, @Body() dto: UpdateUserDto) {
    return this.userService.update(req.user.sub, dto);
  }

  // Admin: get all users
  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAllUsers() {
    return this.userService.findAll();
  }

  // Admin: get user by ID
  @Get(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getUser(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  // Admin: delete user
  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  @Get('role/:roleName')
    @UseGuards(RolesGuard)
    @Roles('admin')
    getUsersByRole(@Param('roleName') roleName: string) {
    return this.userService.findByRole(roleName);
    }

}
