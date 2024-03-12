import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { DuplicateUserException } from '..//exception/duplicate-user.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email } = createUserDto;

    const userExists = await this.userRepository.exists({ where: { email } });

    if (userExists) {
      throw new DuplicateUserException();
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    return user;
  }
}
