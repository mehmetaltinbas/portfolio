import { jwtCookieSettings } from '@/constants/cookie-settings.constant';
import { UserService } from '@/services/user.service';
import { UserSignInDto } from '@/types/dto/user/user-sign-in.dto';
import { ResponseBase } from '@/types/response/response-base';
import { validateDto } from '@/utils/validate-dto.util';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const reqBody = await req.json();

        const validateDtoResponse = await validateDto(UserSignInDto, reqBody);

        if (!validateDtoResponse.isSuccess || !validateDtoResponse.body) {
            return NextResponse.json(validateDtoResponse);
        }

        const response = await UserService.signIn(validateDtoResponse.body);

        if (!response.isSuccess || !response.jwt) return NextResponse.json(response);

        const cookieOptions: Partial<ResponseCookie> = {
            maxAge: jwtCookieSettings.expiresIn,
            secure: jwtCookieSettings.isSecure,
            httpOnly: jwtCookieSettings.isHttpOnly,
            sameSite: jwtCookieSettings.sameSite
        };

        const cookieStore = await cookies();

        cookieStore.set('jwt', response.jwt, cookieOptions);

        const responseBase: ResponseBase = {
            isSuccess: response.isSuccess,
            message: response.message,
        };

        return NextResponse.json(responseBase);
    } catch (error) {
        console.error(error);

        const response: ResponseBase = { isSuccess: false, message: 'internal server error' };
        
        return NextResponse.json(response);
    }
}
