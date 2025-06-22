import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/entities/user.entity';
import { Role } from './users/entities/role.entity';
import { Pet } from './pets/entities/pet.entity';
import { VaccinationRecord } from './vaccination-record/entities/vaccination-record.entity';
import { Reservation } from './reservations/entities/reservation.entity';
import { Service } from './services/entities/service.entity';
import { Payment } from './payments/entities/payment.entity';
import { PetsModule } from './pets/pet.module';
import { SeederModule } from './seeder/seeder.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'database',
      port: 5432,
      username: 'root',
      password: 'root',
      database: 'petcare',
      synchronize: true,
      migrationsRun: false,
      entities: [User, Role, Pet, VaccinationRecord, Reservation, Service, Payment],
      logging: true,
      autoLoadEntities: true,
    }),
    PetsModule,
    SeederModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
