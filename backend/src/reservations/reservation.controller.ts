import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { ReservationsService } from './reservation.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reservations')
// @ApiBearerAuth()
@Controller('reservations')
// @UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
//   @Roles('client', 'admin')
  create(@Body() dto: CreateReservationDto) {
    return this.reservationsService.create(dto);
  }

  @Get()
//   @Roles('admin')
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reservationsService.findOne(+id);
  }

  @Patch(':id')
//   @Roles('admin')
  update(@Param('id') id: string, @Body() dto: UpdateReservationDto) {
    return this.reservationsService.update(+id, dto);
  }

  @Delete(':id')
//   @Roles('admin')
  remove(@Param('id') id: string) {
    return this.reservationsService.remove(+id);
  }

  @Get('provider')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestataire')
  @ApiBearerAuth()
  findByProvider(@Request() req) {
    try {
      console.log('Requête reçue pour les réservations du prestataire');
      console.log('User dans la requête:', req.user);
      
      const providerId = req.user?.userId;
      
      if (!providerId) {
        console.error('ID du prestataire manquant dans la requête');
        throw new BadRequestException('ID du prestataire non trouvé dans la requête');
      }
      
      return this.reservationsService.findByProviderId(providerId);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations du prestataire:', error);
      throw error;
    }
  }
}
