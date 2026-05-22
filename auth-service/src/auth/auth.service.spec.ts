import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from './entities/user.entity';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUser = {
  id: 'uuid-1',
  email: 'test@urbanflow.dz',
  password: '$2b$12$hashedpassword',
  name: 'Test User',
  role: 'ADMIN',
};

const mockUserRepo = {
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn().mockReturnValue('mock-jwt-token'),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: mockUserRepo },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register()', () => {
    it('doit créer un utilisateur et retourner un token', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      mockUserRepo.create.mockReturnValue(mockUser);
      mockUserRepo.save.mockResolvedValue(mockUser);

      const result = await service.register({
        email: 'test@urbanflow.dz',
        password: 'password123',
        name: 'Test User',
        role: 'ADMIN',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user).toEqual(mockUser);
      expect(mockUserRepo.findOne).toHaveBeenCalledTimes(1);
      expect(mockUserRepo.save).toHaveBeenCalledTimes(1);
    });

    it('doit lever ConflictException si email déjà utilisé', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);

      await expect(
        service.register({
          email: 'test@urbanflow.dz',
          password: 'password123',
          name: 'Test',
          role: 'ADMIN',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login()', () => {
    it('doit retourner un token avec des identifiants valides', async () => {
      const hashedPwd = await bcrypt.hash('password123', 12);
      const userWithHash = { ...mockUser, password: hashedPwd };
      mockUserRepo.findOne.mockResolvedValue(userWithHash);

      const result = await service.login({
        email: 'test@urbanflow.dz',
        password: 'password123',
      });

      expect(result.token).toBe('mock-jwt-token');
      expect(result.user.email).toBe('test@urbanflow.dz');
    });

    it('doit lever UnauthorizedException si utilisateur introuvable', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);

      await expect(
        service.login({ email: 'inexistant@urbanflow.dz', password: 'pass' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('doit lever UnauthorizedException si mot de passe incorrect', async () => {
      const hashedPwd = await bcrypt.hash('bon-password', 12);
      mockUserRepo.findOne.mockResolvedValue({ ...mockUser, password: hashedPwd });

      await expect(
        service.login({ email: 'test@urbanflow.dz', password: 'mauvais-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('validateUser()', () => {
    it('doit retourner l\'utilisateur correspondant à l\'id', async () => {
      mockUserRepo.findOne.mockResolvedValue(mockUser);
      const result = await service.validateUser('uuid-1');
      expect(result).toEqual(mockUser);
    });

    it('doit retourner null si utilisateur inexistant', async () => {
      mockUserRepo.findOne.mockResolvedValue(null);
      const result = await service.validateUser('id-inexistant');
      expect(result).toBeNull();
    });
  });
});
