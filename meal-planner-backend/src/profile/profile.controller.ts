import { Controller, Get, Put, Req, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from '../user/user.service';
import { UpdateUserDto } from '../user/dto/update-user.dto';

@Controller('profile')
@UseGuards(AuthGuard('jwt')) 
export class ProfileController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getProfile(@Req() req: any) {
    const user = await this.userService.findById(req.user.userId);
    return user;
  }

  @Put()
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, updateUserDto);
  }
}
