import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Repository, In } from 'typeorm';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { Service } from '../services/entities/service.entity';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(Reservation)
    private readonly reservationRepository: Repository<Reservation>,

    @InjectRepository(Service)
    private readonly serviceRepository: Repository<Service>,
  ) {}


  async create(dto: CreateReservationDto): Promise<Reservation> {
    const { date, time, userId, petId, serviceIds, lieu } = dto;

    // Vérifier si le prestataire est déjà réservé à ce moment-là
    const prestataireBusy = await this.reservationRepository.findOne({
      where: { userId, date, time },
    });

    if (prestataireBusy) {
      throw new BadRequestException(
        `Le prestataire est déjà réservé le ${date} à ${time}.`
      );
    }

    // Vérifier si le pet a déjà une réservation à ce moment-là
    const petBusy = await this.reservationRepository.findOne({
      where: { petId, date, time },
    });

    if (petBusy) {
      throw new BadRequestException(
        `Ce pet a déjà une réservation à cette date et heure (${date} à ${time}).`
      );
    }

    // Charger les entités Service à partir de leurs IDs
    const services = await this.serviceRepository.find({
      where: {
        idservice: In(serviceIds),
      },
    });
    
    if (services.length !== serviceIds.length) {
      throw new BadRequestException("Un ou plusieurs services sont introuvables.");
    }

    const newReservation = this.reservationRepository.create({
      date,
      time,
      lieu,
      userId,
      petId,
      services,
    });

    return this.reservationRepository.save(newReservation);
 }

  

  async findAll(): Promise<Reservation[]> {
    return this.reservationRepository.find({
      relations: ['services', 'pet', 'user'],
    });
  }

  async findOne(id: number) {
    // Vérification stricte que l'ID est un nombre valide
    if (id === undefined || id === null || isNaN(id)) {
      throw new BadRequestException(`ID de réservation invalide: ${id}`);
    }
    
    console.log(`Recherche de la réservation avec ID: ${id}`);
    
    const reservation = await this.reservationRepository.findOne({
      where: { idreserv: id },
      relations: ['pet', 'user', 'services'],
    });
    
    if (!reservation) {
      throw new NotFoundException(`Réservation avec ID ${id} introuvable`);
    }
    
    return reservation;
  }

  async update(id: number, dto: UpdateReservationDto) {
    const reservation = await this.reservationRepository.findOne({
      where: { idreserv: id },
      relations: ['services'], // important pour éviter les conflits lors du merge
    });

    if (!reservation) {
      throw new NotFoundException(`Réservation ${id} introuvable.`);
    }

    const { date, time, userId, petId, serviceIds, ...rest } = dto;

    // Vérifier disponibilité si date/time/userId/petId changent
    const newDate = date ?? reservation.date;
    const newTime = time ?? reservation.time;
    const newUserId = userId ?? reservation.userId;
    const newPetId = petId ?? reservation.petId;

    if (!newTime) {
      throw new BadRequestException("L'heure (time) est requise.");
    }
    // Vérif prestataire
    const prestataireBusy = await this.reservationRepository.findOne({
      where: {
        date: newDate,
        time: newTime,
        userId: newUserId,
      },
    });

    if (prestataireBusy && prestataireBusy.idreserv !== reservation.idreserv) {
      throw new BadRequestException(
        `Le prestataire est déjà réservé le ${newDate} à ${newTime}.`
      );
    }

    // Vérif pet
    const petBusy = await this.reservationRepository.findOne({
      where: {
        date: newDate,
        time: newTime,
        petId: newPetId,
      },
    });

    if (petBusy && petBusy.idreserv !== reservation.idreserv) {
      throw new BadRequestException(
        `Ce pet a déjà une réservation à cette date et heure (${newDate} à ${newTime}).`
      );
    }

    //  Mettre à jour les services si fournis
    if (serviceIds) {
      const services = await this.serviceRepository.find({
        where: { idservice: In(serviceIds) },
      });

      if (services.length !== serviceIds.length) {
        throw new BadRequestException("Un ou plusieurs services sont introuvables.");
      }

      reservation.services = services;
    }

    // Mettre à jour le reste sans écraser les relations
    Object.assign(reservation, {
      date: newDate,
      time: newTime,
      userId: newUserId,
      petId: newPetId,
      ...rest,
    });

    return this.reservationRepository.save(reservation);
  }

  async remove(id: number) {
    const reservation = await this.findOne(id);
    return this.reservationRepository.remove(reservation);
  }

  async findByProviderId(providerId: number): Promise<Reservation[]> {
    // Vérification stricte que providerId est un nombre valide
    if (providerId === undefined || providerId === null || isNaN(providerId)) {
      throw new BadRequestException('ID du prestataire invalide');
    }
    
    console.log(`Recherche des réservations pour le prestataire ID: ${providerId}`);
    
    return this.reservationRepository.find({
      where: { userId: providerId },
      relations: ['services', 'pet', 'user'],
      order: { date: 'DESC', time: 'ASC' }
    });
  }
}
