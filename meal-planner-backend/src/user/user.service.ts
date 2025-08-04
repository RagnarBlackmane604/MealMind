import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { CreateGoogleUserDto } from '../user/dto/create-google-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async createUser(dto: CreateUserDto): Promise<UserDocument> {
    const { password, ...rest } = dto;

    const passwordHash = password ? await bcrypt.hash(password, 10) : undefined;
    const user = new this.userModel({
      ...rest,
      passwordHash,
      isVerified: dto.isVerified ?? false,
    });

    return user.save();
  }

  async createGoogleUser(dto: CreateGoogleUserDto): Promise<UserDocument> {
    const user = new this.userModel({
      ...dto,
      passwordHash: '',
      isVerified:
        (dto as CreateGoogleUserDto & { isVerified?: boolean }).isVerified ??
        false,
    });
    return user.save();
  }

  async findByEmail(
    email: string,
    withPassword = false,
  ): Promise<UserDocument | null> {
    const query = this.userModel.findOne({ email });
    return withPassword ? query.exec() : query.select('-passwordHash').exec();
  }

  async findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId }).exec();
  }

  async findById(userId: string): Promise<UserDocument | null> {
    return this.userModel.findById(userId).select('-passwordHash').exec();
  }

  async updateProfile(
    userId: string,
    dto: UpdateUserDto,
  ): Promise<UserDocument> {
    const updated = await this.userModel.findByIdAndUpdate(userId, dto, {
      new: true,
    });
    if (!updated) throw new NotFoundException('User not found');
    return updated;
  }

  async findOrCreateGoogleUser(googleProfile: {
    id: string;
    email: string;
    name?: string;
    picture?: string;
  }) {
    return this.userModel.findOneAndUpdate(
      { googleId: googleProfile.id },
      {
        $setOnInsert: {
          email: googleProfile.email,
          name: googleProfile.name,
          picture: googleProfile.picture,
          googleId: googleProfile.id,
          isVerified: true,
        },
      },
      { upsert: true, new: true },
    );
  }
}
