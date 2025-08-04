import { Module } from '@nestjs/common';
import { ProfileController } from './profile.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [UserModule],
  controllers: [ProfileController],
})
export class ProfileModule {}
