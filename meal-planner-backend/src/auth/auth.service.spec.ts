import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  let userService: {
    findByEmail: jest.Mock;
    createUser: jest.Mock;
    findByGoogleId: jest.Mock;
    createGoogleUser: jest.Mock;
  };

  let jwtService: {
    sign: jest.Mock;
  };

  let configService: {
    get: jest.Mock;
  };

  beforeEach(async () => {
    userService = {
      findByEmail: jest.fn(),
      createUser: jest.fn(),
      findByGoogleId: jest.fn(),
      createGoogleUser: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(() => 'signed-token'),
    };

    configService = {
      get: jest.fn((key: string) => {
        if (key === 'GOOGLE_CLIENT_ID') return 'test-client-id';
        return null;
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: userService },
        { provide: JwtService, useValue: jwtService },
        { provide: ConfigService, useValue: configService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  describe('signup', () => {
    it('should throw ConflictException if user exists', async () => {
      userService.findByEmail.mockResolvedValue({ id: '123' });

      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'pass',
        firstName: 'Max',
        lastName: 'Mustermann',
      };

      await expect(service.signup(signupDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should create user and return access token', async () => {
      userService.findByEmail.mockResolvedValue(null);
      userService.createUser.mockResolvedValue({
        _id: { toString: () => '123' }, 
        email: 'test@example.com',
      });

      const signupDto: SignupDto = {
        email: 'test@example.com',
        password: 'pass',
        firstName: 'Max',
        lastName: 'Mustermann',
      };

      const result = await service.signup(signupDto);

      expect(result).toEqual({ access_token: 'signed-token' });
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('should throw UnauthorizedException for invalid user', async () => {
      userService.findByEmail.mockResolvedValue(null);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'pass',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      userService.findByEmail.mockResolvedValue({ passwordHash: 'wrong' });
      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(false);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'pass',
      };

      await expect(service.login(loginDto)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should return access token for valid credentials', async () => {
      userService.findByEmail.mockResolvedValue({
        _id: { toString: () => '123' }, 
        email: 'test@example.com',
        passwordHash: 'hash',
      });

      (jest.spyOn(bcrypt, 'compare') as jest.Mock).mockResolvedValue(true);

      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: 'pass',
      };

      const result = await service.login(loginDto);

      expect(result).toEqual({ token: 'signed-token' });
      expect(jwtService.sign).toHaveBeenCalled();
    });
  });

  describe('validateGoogleToken (Bonus)', () => {
    it('should throw UnauthorizedException if token is invalid', async () => {
      (service as any).googleClient = {
        verifyIdToken: jest.fn().mockRejectedValue(new Error('Invalid token')),
      };

      await expect(
        service.validateGoogleToken('invalid-token'),
      ).rejects.toThrow(UnauthorizedException);
    });

   it('should return access token if user exists', async () => {
  const payload = {
    email: 'test@example.com',
    given_name: 'Max',
    family_name: 'Mustermann',
    picture: 'pic-url',
    sub: 'googleId123',
  };

  (service as any).googleClient = {
    verifyIdToken: jest.fn().mockResolvedValue({
      getPayload: () => payload,
    }),
  };

  userService.findByEmail.mockResolvedValue({
    _id: { toString: () => '123' },
    email: payload.email,
  });

  const result = await service.validateGoogleToken('valid-token');

  expect(userService.findByEmail).toHaveBeenCalledWith(payload.email);
  expect(jwtService.sign).toHaveBeenCalledWith({ sub: '123', email: payload.email });
  expect(result).toEqual({ token: 'signed-token' });
});


    it('should create new user if not exists and return token', async () => {
      const payload = {
        email: 'test@example.com',
        given_name: 'Max',
        family_name: 'Mustermann',
        picture: 'pic-url',
        sub: 'googleId123',
      };

      (service as any).googleClient = {
        verifyIdToken: jest.fn().mockResolvedValue({
          getPayload: () => payload,
        }),
      };

      userService.findByGoogleId.mockResolvedValue(null);

      userService.createGoogleUser.mockResolvedValue({
        _id: { toString: () => '123' }, 
        email: payload.email,
      });

      const result = await service.validateGoogleToken('valid-token');

      expect(userService.createGoogleUser).toHaveBeenCalledWith({
        email: payload.email,
        name: `${payload.given_name} ${payload.family_name}`,
        picture: payload.picture,
        googleId: payload.sub,
      });

      expect(jwtService.sign).toHaveBeenCalledWith({
        sub: '123',
        email: payload.email,
      });
      expect(result).toEqual({ token: 'signed-token' });
    });
  });
});
