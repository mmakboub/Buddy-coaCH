import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';

import { Inject, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(@Inject(UsersService)
    private readonly usersService: UsersService,) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    try {
      const { id, displayName, emails, photos } = profile;
      const firstname = profile.name?.givenName; // Assure-toi que `profile.name` existe
      const lastname = profile.name?.familyName; // Assure-toi que `profile.name` existe
      const email = emails[0]?.value; // Assure-toi que `emails` n'est pas vide
      const birthDate = null; // Google n'envoie pas de date de naissance, tu devras peut-être demander cela séparément
      const pays = null; // Google n'envoie pas de pays, tu devras peut-être demander cela séparément
  
      // Cherche ou crée l'utilisateur dans la base de données
      const user = await this.usersService.findOrCreateUser({
        firstname,
        lastname,
        email,
        birthDate,
        pays,
      });
  
      // Passe l'utilisateur validé au callback
      return user;
    } catch (error) {
      // Gère les erreurs de manière appropriée
      done(error, null);
    }
  }
}