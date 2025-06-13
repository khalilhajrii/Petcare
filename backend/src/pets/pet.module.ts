import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Pet } from "./entities/pet.entity";
import { User } from "src/users/entities/user.entity";
import { VaccinationRecord } from "src/vaccination-record/entities/vaccination-record.entity";
import { Reservation } from "src/reservations/entities/reservation.entity";
import { PetsController } from "./pet.controller";
import { PetsService } from "./pet.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([Pet, User, VaccinationRecord, Reservation]),
    ],
    controllers: [PetsController],
    providers: [PetsService],
    exports: [PetsService],
})
export class PetsModule {}