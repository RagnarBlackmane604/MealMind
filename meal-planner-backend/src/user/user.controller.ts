import { Controller, Get, Param, Put, Body, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req: any) {
    return this.userService.findById(req.user.userId);
  }

  @Get(':id')
async getUserById(@Param('id') id: string) {
  return this.userService.findById(id);
}

  @Put('profile')
  async updateProfile(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateProfile(req.user.userId, updateUserDto);
  }
}
