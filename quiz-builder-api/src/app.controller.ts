import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Res,
  Request,
  UseGuards,
} from '@nestjs/common';

import { AuthService, JwtAuthGuard, LocalAuthGuard } from './auth';
import { UserService } from './user';

@Controller()
export class AppController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('user/register')
  async register(@Res() res, @Body() createUserData: any) {
    if (await this.userService.findOne(createUserData.username)) {
      return res.status(HttpStatus.OK).json({
        message: 'User already registered',
      });
    }

    const user = await this.userService.create(createUserData);
    return res.status(HttpStatus.OK).json({
      message: 'User has been created successfully',
      user,
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('user/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
