import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/users/user.service';

interface JwtPayload {
  sub: number;
  email: string;
  role?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || '123',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('JWT Strategy - Validating token payload:', payload);
    
    try {
      const user = await this.userService.findOne(payload.sub);
      
      if (!user) {
        console.error('JWT Strategy - User not found for id:', payload.sub);
        throw new UnauthorizedException('User not found');
      }
      
      console.log('JWT Strategy - User authenticated successfully:', user.id);
      
      return {
        id: user.id,
        email: user.email,
        role: user.role?.roleName, // 'admin', 'client', etc.
      };
    } catch (error) {
      console.error('JWT Strategy - Error validating token:', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
