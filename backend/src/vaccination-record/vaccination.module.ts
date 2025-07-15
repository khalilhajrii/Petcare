import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { VaccinationRecord } from "./entities/vaccination-record.entity";
import { Pet } from "src/pets/entities/pet.entity";
import { VaccinationRecordsController } from "./vaccination.controller";
import { VaccinationRecordsService } from "./vaccination.service";

@Module({
  imports: [TypeOrmModule.forFeature([VaccinationRecord, Pet])],
  controllers: [VaccinationRecordsController],
  providers: [VaccinationRecordsService],
  exports: [VaccinationRecordsService],
})
export class VaccinationRecordsModule {}