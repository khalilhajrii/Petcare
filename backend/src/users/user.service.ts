import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string, withPassword = false) {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['role'],
      select: withPassword
        ? ['id', 'email', 'password', 'firstName', 'lastName']
        : undefined,
    });

    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async createUser(registerDto: RegisterDto) : Promise<User> {
    const { email, password, firstName, lastName, phone, address, roleId } = registerDto;
    const existing = await this.userRepository.findOne({ where:{email}});
    if(existing ) {
      throw new NotFoundException('User already exists with this email');
    }
    const salt = await bcrypt.genSalt(8);
    const hashedPasword = await bcrypt.hash(password, salt);

    const newUser = this.userRepository.create({
      email,
      password: hashedPasword,
      firstName,
      lastName,
      phone,
      address,
      role: { id: roleId }, 
    });
    return this.userRepository.save(newUser);
  }

  async findOne(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['role'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async update(id: number, dto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, dto);
    return this.findOne(id);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({ relations: ['role'] });
  }

  async remove(id: number): Promise<void> {
    await this.userRepository.delete(id);
  }

  async findByRole(roleName: string): Promise<User[]> {
    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.roleName = :roleName', { roleName })
      .getMany();
  }


  // You can add createUser(), updateUser(), etc. here later
}
