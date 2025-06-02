import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './Entity/user.entity';
import { Role } from './Entity/role.entity';
import { Pet } from './Entity/pet.entity';
import { VaccinationRecord } from './Entity/vaccination-record.entity';
import { Reservation } from './Entity/reservation.entity';
import { Service } from './Entity/service.entity';
import { Payment } from './Entity/payment.entity';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
