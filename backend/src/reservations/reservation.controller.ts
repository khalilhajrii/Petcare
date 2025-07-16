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
  async findByProvider(@Request() req) {
    try {
      console.log('Requête reçue pour les réservations du prestataire');
      console.log('User dans la requête:', req.user);
      
      const providerId = req.user?.id;
      console.log('Provider ID extrait:', providerId, 'Type:', typeof providerId);
      
      if (!providerId) {
        console.error('ID du prestataire manquant dans la requête');
        throw new BadRequestException('ID du prestataire non trouvé dans la requête');
      }
      
      // Vérifier que providerId est un nombre valide
      if (isNaN(Number(providerId))) {
        console.error(`ID du prestataire invalide (non numérique): ${providerId}`);
        throw new BadRequestException(`ID du prestataire invalide: ${providerId}`);
      }
      
      const reservations = await this.reservationsService.findAllReservationsForProvider(Number(providerId));
      console.log(`Nombre de réservations trouvées: ${reservations.length}`);
      return reservations;
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations du prestataire:', error);
      throw error;
    }
  }
  
  @Get('provider/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestataire', 'admin')
  @ApiBearerAuth()
  findByProviderIdParam(@Param('id') id: string) {
    try {
      console.log(`Récupération des réservations pour le prestataire ID: ${id}`);
      if (!id || isNaN(+id)) {
        console.error(`ID du prestataire invalide: ${id}`);
        throw new BadRequestException(`ID du prestataire invalide: ${id}`);
      }
      
      // Utiliser findAllReservationsForProvider au lieu de findByProviderId
      // pour assurer la cohérence avec l'autre endpoint
      return this.reservationsService.findAllReservationsForProvider(+id);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations du prestataire:', error);
      throw error;
    }
  }
  
  @Get('client')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @ApiBearerAuth()
  findByClient(@Request() req) {
    try {
      const clientId = req.user?.id;
      if (!clientId) {
        console.error('ID du client manquant dans la requête');
        throw new BadRequestException('ID du client non trouvé dans la requête');
      }
      
      return this.reservationsService.findByClientId(clientId);
    } catch (error) {
      console.error('Erreur lors de la récupération des réservations du client:', error);
      throw error;
    }
  }
  
  @Get('client/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('client')
  @ApiBearerAuth()
  findByClientId(@Param('id') id: string) {
    try {
      console.log(`Récupération des réservations pour le client ID: ${id}`);
      if (!id || isNaN(+id)) {
        console.error(`ID du client invalide: ${id}`);
        throw new BadRequestException(`ID du client invalide: ${id}`);
      }
      
      return this.reservationsService.findByClientId(+id);
    } catch (error) {
      console.error(`Erreur lors de la récupération des réservations pour le client ID ${id}:`, error);
      throw error;
    }
  }

  @Get('service/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('prestataire')
  @ApiBearerAuth()
  findByServiceId(@Param('id') id: string) {
    try {
      console.log(`Récupération des réservations pour le service ID: ${id}`);
      if (!id || isNaN(+id)) {
        console.error(`ID du service invalide: ${id}`);
        throw new BadRequestException(`ID du service invalide: ${id}`);
      }
      
      return this.reservationsService.findByServiceId(+id);
    } catch (error) {
      console.error(`Erreur lors de la récupération des réservations pour le service ID ${id}:`, error);
      throw error;
    }
  }
}
