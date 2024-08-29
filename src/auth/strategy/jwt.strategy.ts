import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private usersService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:process.env.JWT_SECRET,
      ignoreExpiration: false,
    });
  }
  async validate(payload: any) {
    try {
      const user = await this.usersService.findOrCreateUser({
        firstname: payload.firstname,
        lastname: payload.lastname,
        email: payload.email,
        birthDate: payload.birthDate,
        pays: payload.pays,
        cnxtype: payload.cnxtype,
      });
      return user;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }

}