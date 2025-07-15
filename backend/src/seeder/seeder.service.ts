// import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import { User } from '../users/entities/user.entity';
// import { Role } from '../users/entities/role.entity';
// import { Pet } from '../pets/entities/pet.entity';
// import { Service } from '../services/entities/service.entity';
// import { Reservation } from '../reservations/entities/reservation.entity';

// @Injectable()
// export class SeederService implements OnModuleInit {
//   private readonly logger = new Logger(SeederService.name);

//   constructor(
//     @InjectRepository(Role)
//     private roleRepository: Repository<Role>,
//     @InjectRepository(User)
//     private userRepository: Repository<User>,
//     @InjectRepository(Pet)
//     private petRepository: Repository<Pet>,
//     @InjectRepository(Service)
//     private serviceRepository: Repository<Service>,
//     @InjectRepository(Reservation)
//     private reservationRepository: Repository<Reservation>,
//   ) {}

//   async onModuleInit() {
//     this.logger.log('Seeder module initialized, starting database seeding...');
//     await this.seedRoles();
//     await this.seedUsers();
//     await this.seedPets();
//     await this.seedServices();
//     await this.seedReservations();
//     this.logger.log('Database seeding completed successfully!');
//   }

//   async seedRoles() {
//     const count = await this.roleRepository.count();
//     if (count === 0) {
//       this.logger.log('Seeding roles...');
//       const roles = [
//         { roleName: 'admin' },
//         { roleName: 'user' },
//         { roleName: 'veterinarian' },
//       ];

//       for (const role of roles) {
//         await this.roleRepository.save(role);
//       }
//       this.logger.log(`${roles.length} roles created`);
//     } else {
//       this.logger.log('Roles already exist, skipping seeding');
//     }
//   }

//   async seedUsers() {
//     const count = await this.userRepository.count();
//     if (count === 0) {
//       this.logger.log('Seeding users...');
      
//       // Get roles - throw error if roles don't exist (they should be seeded first)
//       const adminRole = await this.roleRepository.findOneOrFail({ where: { roleName: 'admin' } });
//       const userRole = await this.roleRepository.findOneOrFail({ where: { roleName: 'user' } });
//       const vetRole = await this.roleRepository.findOneOrFail({ where: { roleName: 'veterinarian' } });
      
//       const users = [
//         {
//           firstName: 'Admin',
//           lastName: 'User',
//           email: 'admin@petcare.com',
//           password: 'admin123', // In a real app, this should be hashed
//           address: 'Admin Address 123',
//           role: adminRole,
//         },
//         {
//           firstName: 'John',
//           lastName: 'Doe',
//           email: 'john@example.com',
//           password: 'password123',
//           address: '123 Main St, Anytown',
//           role: userRole,
//         },
//         {
//           firstName: 'Jane',
//           lastName: 'Smith',
//           email: 'jane@example.com',
//           password: 'password123',
//           address: '456 Oak Ave, Somewhere',
//           role: userRole,
//         },
//         {
//           firstName: 'Dr. Alex',
//           lastName: 'Johnson',
//           email: 'alex@vetclinic.com',
//           password: 'vet123',
//           address: '789 Vet Clinic Rd, Petville',
//           role: vetRole,
//         },
//       ];

//       // Save users one by one
//       for (const user of users) {
//         const userEntity = this.userRepository.create(user);
//         await this.userRepository.save(userEntity);
//       }
//       this.logger.log(`${users.length} users created`);
//     } else {
//       this.logger.log('Users already exist, skipping seeding');
//     }
//   }
//   async seedPets() {
//     const count = await this.petRepository.count();
//     if (count === 0) {
//       this.logger.log('Seeding pets...');
      
//       // Get user IDs
//       const users = await this.userRepository.find({ 
//         where: [{ email: 'john@example.com' }, { email: 'jane@example.com' }] 
//       });
      
//       if (users.length > 0) {
//         const pets = [
//           {
//             nom: 'Max',
//             type: 'Dog',
//             age: 3,
//             race: 'Golden Retriever',
//             userId: users[0].id,
//           },
//           {
//             nom: 'Bella',
//             type: 'Cat',
//             age: 2,
//             race: 'Siamese',
//             userId: users[0].id,
//           },
//           {
//             nom: 'Charlie',
//             type: 'Dog',
//             age: 5,
//             race: 'Beagle',
//             userId: users[1].id,
//           },
//           {
//             nom: 'Luna',
//             type: 'Cat',
//             age: 1,
//             race: 'Persian',
//             userId: users[1].id,
//           },
//         ];

//         for (const pet of pets) {
//           await this.petRepository.save(pet);
//         }
//         this.logger.log(`${pets.length} pets created`);
//       }
//     } else {
//       this.logger.log('Pets already exist, skipping seeding');
//     }
//   }

//   async seedServices() {
//     const count = await this.serviceRepository.count();
//     if (count === 0) {
//       this.logger.log('Seeding services...');
      
//       const services = [
//         {
//           nomservice: 'Basic Checkup',
//           prixService: 50.0,
//           description: 'Regular health checkup for your pet',
//           servicedetail: 'Includes physical examination, weight check, and basic health assessment',
//         },
//         {
//           nomservice: 'Vaccination',
//           prixService: 75.0,
//           description: 'Essential vaccinations for your pet',
//           servicedetail: 'Includes core vaccines appropriate for your pet\'s species, age, and lifestyle',
//         },
//         {
//           nomservice: 'Grooming',
//           prixService: 45.0,
//           description: 'Complete grooming service',
//           servicedetail: 'Includes bath, haircut, nail trimming, ear cleaning, and more',
//         },
//         {
//           nomservice: 'Dental Cleaning',
//           prixService: 120.0,
//           description: 'Professional dental care',
//           servicedetail: 'Includes scaling, polishing, and oral examination',
//         },
//       ];

//       for (const service of services) {
//         await this.serviceRepository.save(service);
//       }
//       this.logger.log(`${services.length} services created`);
//     } else {
//       this.logger.log('Services already exist, skipping seeding');
//     }
//   }

//   async seedReservations() {
//     const count = await this.reservationRepository.count();
//     if (count === 0) {
//       this.logger.log('Seeding reservations...');
      
//       // Get users, pets, and services for creating reservations
//       const users = await this.userRepository.find({ 
//         where: [{ email: 'john@example.com' }, { email: 'jane@example.com' }] 
//       });
      
//       const pets = await this.petRepository.find();
//       const services = await this.serviceRepository.find();
      
//       if (users.length > 0 && pets.length > 0 && services.length > 0) {
//         // Create sample reservations with services
//         const reservations = [
//           {
//             date: new Date('2023-12-15'),
//             lieu: 'Main Clinic',
//             time: '10:00 AM',
//             pet: pets[0], // Max (John's dog)
//             user: users[0], // John
//             services: [services[0], services[1]] // Basic Checkup and Vaccination
//           },
//           {
//             date: new Date('2023-12-20'),
//             lieu: 'Pet Spa Center',
//             time: '2:30 PM',
//             pet: pets[1], // Bella (John's cat)
//             user: users[0], // John
//             services: [services[2]] // Grooming
//           },
//           {
//             date: new Date('2023-12-22'),
//             lieu: 'Dental Clinic',
//             time: '11:15 AM',
//             pet: pets[2], // Charlie (Jane's dog)
//             user: users[1], // Jane
//             services: [services[3]] // Dental Cleaning
//           },
//           {
//             date: new Date('2023-12-28'),
//             lieu: 'Main Clinic',
//             time: '3:00 PM',
//             pet: pets[3], // Luna (Jane's cat)
//             user: users[1], // Jane
//             services: [services[0], services[2]] // Basic Checkup and Grooming
//           },
//         ];

//         for (const reservation of reservations) {
//           await this.reservationRepository.save(reservation);
//         }
//         this.logger.log(`${reservations.length} reservations created with their associated services`);
//       }
//     } else {
//       this.logger.log('Reservations already exist, skipping seeding');
//     }
//   }
// }