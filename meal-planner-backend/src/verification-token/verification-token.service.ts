import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { VerificationToken } from './verification-token.schema';

@Injectable()
export class VerificationTokenService {
  constructor(
    @InjectModel(VerificationToken.name)
    private verificationTokenModel: Model<VerificationToken>,
  ) {}

  async createToken(email: string, token: string, expires: Date) {
    return this.verificationTokenModel.create({ email, token, expires });
  }

  async findToken(email: string, token: string) {
    return this.verificationTokenModel.findOne({ email, token });
  }

  async deleteToken(email: string, token: string): Promise<any> {
    return this.verificationTokenModel.deleteOne({ email, token });
  }
}
