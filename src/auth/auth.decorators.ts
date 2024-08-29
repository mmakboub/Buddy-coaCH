import { applyDecorators } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOkResponse,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { CreateUserDto } from './dto/creatUser.dto';
import { LoginDto } from './dto/login.dto';

export function register() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOkResponse({ description: 'creates a new user', type: CreateUserDto }),
    );
}

export function login() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOkResponse({ description: 'Returns the access token', type: LoginDto }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}


export function forgotPassword() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOkResponse({ description: 'Returns the OTP' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
export function resetPassword() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOkResponse({ description: 'Returns the new password' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );
}
export function GoogleLogin() {
    return applyDecorators(
        ApiBearerAuth(),
        ApiOkResponse({ description: 'Redirects to Google login page' }),
        ApiUnauthorizedResponse({ description: 'Unauthorized' }),
    );

}
export function GoogleCallback() {return applyDecorators(
    ApiOkResponse({ description: 'Redirects to frontend URL' }),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
 
}
export function logout(){return applyDecorators(
    ApiOkResponse({ description: 'logged out' }),
        ApiUnauthorizedResponse({ description: 'failed to logout' }))
}