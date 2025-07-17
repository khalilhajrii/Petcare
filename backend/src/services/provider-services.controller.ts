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
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Provider Services')
@ApiBearerAuth()
@Controller('provider/services')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProviderServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @Roles('prestataire')
  async create(@Request() req, @Body() createServiceDto: CreateServiceDto) {
    // Ajouter l'ID de l'utilisateur connecté au service
    createServiceDto.userId = req.user.id;
    return this.servicesService.create(createServiceDto);
  }

  @Get()
  @Roles('prestataire')
  async findAll(@Request() req) {
    // Récupérer uniquement les services de l'utilisateur connecté
    return this.servicesService.findByUserId(req.user.id);
  }

  @Get(':id')
  @Roles('prestataire')
  async findOne(@Request() req, @Param('id') id: string) {
    // Vérifier que le service appartient à l'utilisateur connecté
    return this.servicesService.findOneByUser(+id, req.user.id);
  }

  @Patch(':id')
  @Roles('prestataire')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    // Vérifier que le service appartient à l'utilisateur connecté
    return this.servicesService.updateByUser(+id, req.user.id, updateServiceDto);
  }

  @Delete(':id')
  @Roles('prestataire')
  async remove(@Request() req, @Param('id') id: string) {
    // Vérifier que le service appartient à l'utilisateur connecté
    return this.servicesService.removeByUser(+id, req.user.id);
  }
}