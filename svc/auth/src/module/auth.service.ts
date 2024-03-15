import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { ApiResponse } from '../api/api-response';
import { Code } from '../code/code';
import { DuplicateUserException } from '../exception/duplicate-user.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async create(
    createUserDto: CreateUserDto,
  ): Promise<ApiResponse<User>> {
    const { email } = createUserDto;

    const userExists = await this.userRepository.exists({ where: { email } });

    if (userExists) {
      throw new DuplicateUserException('이미 사용 중인 이메일입니다');
    }

    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);

    return ApiResponse.handleSuccess(
      Code.CREATED.code,
      Code.CREATED.message,
      user,
    );
  }
}
