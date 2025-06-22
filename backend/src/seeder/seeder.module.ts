import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Role } from '../users/entities/role.entity';
import { Pet } from '../pets/entities/pet.entity';
import { Service } from '../services/entities/service.entity';
import { Reservation } from '../reservations/entities/reservation.entity';
import { SeederService } from './seeder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role, Pet, Service, Reservation]),
  ],
  providers: [SeederService],
  exports: [SeederService],
})
export class SeederModule {}