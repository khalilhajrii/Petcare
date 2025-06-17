import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { RegisterDto } from '../users/dto/register.dto';
import { UsersService } from '../users/user.service';
import { ApiTags, ApiBody } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  @Post('login')
  @ApiBody({ type: LoginDto })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);
    return this.authService.login(user);
  }

  @Post('register')
  @ApiBody({ type: RegisterDto })
  async register(@Body() dto: RegisterDto) {
    const user = await this.userService.createUser(dto);
    return this.authService.login(user); // auto-login après inscription
  }
}
