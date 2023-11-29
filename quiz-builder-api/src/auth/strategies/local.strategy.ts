import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';

import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<any> {
    const uname = await this.authService.validateUsername(username);
    if (!uname) {
      throw new BadRequestException('Please register first');
    }
    const user = await this.authService.validateUser(username, password);
    if (!user) {
      throw new BadRequestException('Username or password is incorrect');
    }
    return user;
  }
}
