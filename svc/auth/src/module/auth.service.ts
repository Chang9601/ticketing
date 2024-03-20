import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../entity/user.entity';
import { ApiResponse } from '../api/api-response';
import { Code } from '../code/code';
import { DuplicateUserException } from '../exception/duplicate-user.exception';
import { UserMapper } from '../mapper/user-mapper';
import { UserDto } from '../dto/user.dto';
import { Password } from 'src/util/password';
import { InvalidCredentialException } from 'src/exception/invalid-credential.exception';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  public async create(user: User): Promise<ApiResponse<UserDto>> {
    const { email, password } = user;

    const userExists = await this.userRepository.exists({ where: { email } });

    if (userExists) {
      throw new DuplicateUserException('이미 사용 중인 이메일입니다');
    }

    const userEntity = this.userRepository.create({
      ...user,
      password: await Password.hash(password),
    });

    await this.userRepository.save(userEntity);

    return ApiResponse.handleSuccess(
      Code.CREATED.code,
      Code.CREATED.message,
      UserMapper.toDto(userEntity),
    );
  }

  public async validate(email: string, password: string): Promise<User> {
    const userExists = await this.userRepository.exists({ where: { email } });

    if (!userExists) {
      throw new InvalidCredentialException(
        '이메일 혹은 비밀번호가 유효하지 않습니다.',
      );
    }

    const user = await this.userRepository.findOne({ where: { email } });

    if (!Password.compare(password, user.password)) {
      throw new InvalidCredentialException(
        '이메일 혹은 비밀번호가 유효하지 않습니다.',
      );
    }

    return user;
  }
}
