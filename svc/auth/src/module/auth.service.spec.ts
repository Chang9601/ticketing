import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { AuthService } from './auth.service';
import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';
import { Password } from '../util/password';
import { DuplicateUserException } from '../exception/duplicate-user.exception';

const userDto = new UserDto('abc@naver.com', '1234');
const userEntity = new UserEntity('abc@naver.com', '1234');

describe('AuthService', () => {
  let authService: AuthService;
  let userRepository: Repository<UserEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {
            create: jest.fn().mockReturnValue(userEntity),
            exists: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {},
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<UserEntity>>(
      getRepositoryToken(UserEntity),
    );
  });

  it('authService는 정의되어야 한다.', () => {
    expect(authService).toBeDefined();
  });

  describe('create', () => {
    it('사용자를 생성해야 한다.', async () => {
      jest.spyOn(userRepository, 'save').mockResolvedValueOnce(userEntity);

      const user = await authService.create(userDto);

      expect(user).toBeDefined();
      expect(user.metadata.code).toBe(201);
      expect(user.data.password).toBe('');
    });

    it('이미 사용 중인 이메일로 회원가입을 시도하기 때문에 실패한다.', async () => {
      jest
        .spyOn(userRepository, 'save')
        .mockRejectedValueOnce(new DuplicateUserException());

      await expect(authService.create(userDto)).rejects.toThrow(
        DuplicateUserException,
      );
    });
  });

  describe('validate', () => {
    it('이메일과 비밀번호로 사용자를 검증하며 성공한다.', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true);
      jest.spyOn(userRepository, 'findOne').mockImplementationOnce(async () =>
        Promise.resolve({
          ...userEntity,
          password: await Password.hash(userEntity.password),
        }),
      );

      const user = await authService.validate(userDto.email, userDto.password);

      expect(user).toBeDefined();
      expect(user.email).toBe(userEntity.email);
    });
  });
});
