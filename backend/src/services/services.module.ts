import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { ProviderServicesController } from './provider-services.controller';
import { Service } from './entities/service.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Service])],
  controllers: [ServicesController, ProviderServicesController],
  providers: [ServicesService],
  exports: [ServicesService], 
})
export class ServicesModule {}
