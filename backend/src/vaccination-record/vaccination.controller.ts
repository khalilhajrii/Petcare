import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { VaccinationRecordsService } from "./vaccination.service";
import { VaccinationRecord } from "./entities/vaccination-record.entity";
import { CreateVaccinationRecordDto } from "./dto/create-vaccination-record.dto";
import { UpdateVaccinationRecordDto } from "./dto/update-vaccination-record.dto";

@ApiTags('Vaccination Records')
@Controller('vaccination-records')
export class VaccinationRecordsController {
  constructor(
    private readonly vaccinationRecordsService: VaccinationRecordsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a vaccination record' })
  @ApiResponse({
    status: 201,
    description: 'The vaccination record has been successfully created.',
    type: VaccinationRecord,
  })
  create(
    @Body() createVaccinationRecordDto: CreateVaccinationRecordDto,
  ): Promise<VaccinationRecord> {
    return this.vaccinationRecordsService.create(createVaccinationRecordDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all vaccination records' })
  @ApiResponse({
    status: 200,
    description: 'Return all vaccination records.',
    type: [VaccinationRecord],
  })
  findAll(): Promise<VaccinationRecord[]> {
    return this.vaccinationRecordsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a vaccination record by ID' })
  @ApiResponse({
    status: 200,
    description: 'Return the vaccination record.',
    type: VaccinationRecord,
  })
  @ApiResponse({ status: 404, description: 'Vaccination record not found.' })
  findOne(@Param('id') id: string): Promise<VaccinationRecord> {
    return this.vaccinationRecordsService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a vaccination record' })
  @ApiResponse({
    status: 200,
    description: 'The vaccination record has been successfully updated.',
    type: VaccinationRecord,
  })
  @ApiResponse({ status: 404, description: 'Vaccination record not found.' })
  update(
    @Param('id') id: string,
    @Body() updateVaccinationRecordDto: UpdateVaccinationRecordDto,
  ): Promise<VaccinationRecord> {
    return this.vaccinationRecordsService.update(+id, updateVaccinationRecordDto);
  }


  @Delete(':id')
  @ApiOperation({ summary: 'Delete a vaccination record' })
  @ApiResponse({
    status: 200,
    description: 'The vaccination record has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'Vaccination record not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.vaccinationRecordsService.remove(+id);
  }

  @Get('pet/:petId')
  @ApiOperation({ summary: 'Get vaccination records by pet ID' })
  @ApiResponse({
    status: 200,
    description: 'Return vaccination records for the specified pet.',
    type: [VaccinationRecord],
  })
  findByPet(@Param('petId') petId: string): Promise<VaccinationRecord[]> {
    return this.vaccinationRecordsService.findByPet(+petId);
  }
}

