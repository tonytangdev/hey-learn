/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthGard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const key = req.headers['x-api-key'];
    console.log({ header: req.headers });

    const validAPIKey = this.configService.get('VALID_API_KEY');
    console.log('validAPIKey', validAPIKey);
    console.log('key', key);
    if (key !== validAPIKey) {
      return false;
    }

    return true;
  }
}
