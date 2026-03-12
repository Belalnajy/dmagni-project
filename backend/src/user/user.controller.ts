import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile/:id')
  getProfile(@Param('id') id: string) {
    return this.userService.getProfile(id);
  }
}
