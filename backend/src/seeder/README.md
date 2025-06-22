# Database Seeder Module

This module is responsible for initializing the database with sample data when the application starts.

## How it works

The seeder module uses NestJS's `OnModuleInit` lifecycle hook to automatically seed the database when the application starts. It checks if data already exists in each table before adding new records, ensuring that it doesn't duplicate data on subsequent application starts.

## Seeded Data

The seeder initializes the following data:

### Roles
- admin
- user
- veterinarian

### Users
- Admin user (admin@petcare.com)
- Regular users (john@example.com, jane@example.com)
- Veterinarian (alex@vetclinic.com)

### Pets
- Several pets associated with the regular users

### Services
- Basic pet care services with pricing

## Customization

To modify the seed data, edit the corresponding seed methods in the `seeder.service.ts` file.