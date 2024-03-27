import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';

import { AuthService } from './auth.service';
import { UserEntity } from '../entity/user.entity';
import { UserDto } from '../dto/user.dto';
import { Password } from '../util/password';
import { DuplicateUserException } from '../exception/duplicate-user.exception';
import { InvalidCredentialException } from '../exception/invalid-credential.exception';
import { UserNotFoundException } from '../exception/user-not-found.exception';
import { Code } from '../code/code';
import { TokenPayload, UserPayload } from '../type/auth-type';

const userDto = new UserDto('abc@naver.com', '1234');
const userEntity = new UserEntity('abc@naver.com', '1234');
const userPayload: UserPayload = { id: userEntity.id, email: userEntity.email };
const tokenPayload: TokenPayload = { id: userEntity.id };

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
            save: jest.fn().mockResolvedValue(userEntity),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('jwt-token'),
          },
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
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false);

      const user = await authService.create(userDto);

      expect(user).toBeDefined();
      expect(user.metadata.code).toBe(Code.CREATED.code);
      expect(user.data.password).toBe('');
    });

    it('이미 사용 중인 이메일로 회원가입을 시도하기 때문에 실패한다.', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true);

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

      const userPayload = await authService.validate(
        userDto.email,
        userDto.password,
      );

      expect(userPayload).toBeDefined();
      expect(userPayload.email).toBe(userEntity.email);
    });

    it('이메일이 유효하지 않아 사용자 검증에 실패한다.', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false);

      await expect(
        authService.validate(userDto.email, userDto.password),
      ).rejects.toThrow(new InvalidCredentialException());
    });

    it('비밀번호가 유효하지 않아 사용자 검증에 실패한다.', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userEntity);

      await expect(
        authService.validate(userDto.email, userDto.password),
      ).rejects.toThrow(new InvalidCredentialException());
    });
  });

  describe('signIn', () => {
    it('JWT 토큰을 가지고 있는 쿠키를 생성한다.', async () => {
      const cookie = await authService.signIn(userPayload);

      expect(cookie).toBeDefined();
    });
  });

  describe('findOne', () => {
    it('아이디로 사용자를 찾아야 한다.', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(true);
      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(userEntity);

      const userPayload = await authService.findOne(tokenPayload.id);

      expect(userPayload.email).toBe(userEntity.email);
    });

    it('아이디가 유효하지 않아 사용자를 찾지 못한다.', async () => {
      jest.spyOn(userRepository, 'exists').mockResolvedValueOnce(false);

      await expect(authService.findOne(tokenPayload.id)).rejects.toThrow(
        new UserNotFoundException(),
      );
    });
  });
});
