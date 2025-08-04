import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UserService } from './user.service';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcrypt';
import { NotFoundException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userModel: jest.Mocked<any> & {
    findOne: jest.Mock;
    findById: jest.Mock;
    findByIdAndUpdate: jest.Mock;
  };

  beforeEach(async () => {
    userModel = jest.fn() as any;
    userModel.findOne = jest.fn();
    userModel.findById = jest.fn();
    userModel.findByIdAndUpdate = jest.fn();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getModelToken(User.name), useValue: userModel },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should find user by email without passwordHash', async () => {
    const execMock = jest.fn().mockResolvedValue({ email: 'test@example.com' });
    userModel.findOne.mockReturnValue({
      select: jest.fn().mockReturnValue({ exec: execMock }),
    });

    const user = await service.findByEmail('test@example.com');

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
    expect(user).toEqual({ email: 'test@example.com' });
  });

  it('should find user by email with passwordHash', async () => {
    const execMock = jest.fn().mockResolvedValue({ email: 'test@example.com', passwordHash: 'hash' });
    userModel.findOne.mockReturnValue({ exec: execMock });

    const user = await service.findByEmail('test@example.com', true);

    expect(userModel.findOne).toHaveBeenCalledWith({
      email: 'test@example.com',
    });
    expect(user).toEqual({ email: 'test@example.com', passwordHash: 'hash' });
  });

  it('should create a new user with hashed password', async () => {
    const dto = {
      email: 'test@example.com',
      password: 'password123',
      firstName: 'Max',
      lastName: 'Mustermann',
    };

    jest.spyOn(bcrypt, 'hash').mockImplementation(() => Promise.resolve('hashedPassword'));

    const saveMock = jest.fn().mockResolvedValue({
      email: dto.email,
      passwordHash: 'hashedPassword',
    });

    userModel.mockImplementation(function (this: any, data) {
      Object.assign(this, data);
      this.save = saveMock;
    });

    const result = await service.createUser(dto);

    expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
    expect(saveMock).toHaveBeenCalled();
    expect(result.passwordHash).toBe('hashedPassword');
    expect(result.email).toBe(dto.email);
  });

  it('should create a new google user without passwordHash', async () => {
    const dto = {
      email: 'google@example.com',
      googleId: 'googleId123',
      name: 'Max Mustermann',
      picture: 'pic-url',
    };

    const saveMock = jest.fn().mockResolvedValue({
      ...dto,
      passwordHash: '',
    });

    userModel.mockImplementation(function (this: any, data) {
      Object.assign(this, data);
      this.save = saveMock;
    });

    const result = await service.createGoogleUser(dto);

    expect(saveMock).toHaveBeenCalled();
    expect(result.passwordHash).toBe('');
    expect(result.email).toBe(dto.email);
    expect(result.googleId).toBe(dto.googleId);
  });

  it('should update user profile', async () => {
  const updatedUser = { email: 'updated@example.com', firstName: 'Updated' };
  userModel.findByIdAndUpdate.mockResolvedValue(updatedUser);

  const updateData = { firstName: 'Updated' } as any;

  const result = await service.updateProfile('userId123', updateData);

  expect(userModel.findByIdAndUpdate).toHaveBeenCalledWith(
    'userId123',
    updateData,
    { new: true },
  );
  expect(result).toEqual(updatedUser);
});


  it('should throw NotFoundException if user not found on update', async () => {
    userModel.findByIdAndUpdate.mockResolvedValue(null);


    const updateData = { firstName: 'Updated' } as any;

    await expect(
      service.updateProfile('nonexistentId', updateData),
    ).rejects.toThrow('User not found');
  });
});
