import { ResponseBase } from '@/types/response/response-base';
import { NextResponse, NextRequest } from 'next/server';
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { DecodedJwtPayload } from '@/types/jwt-payload';

const userId = process.env.USER_ID;
 
// This function can be marked `async` if using `await` inside
export function proxy(request: NextRequest) {
    const jwt = request.cookies.get('jwt')?.value;
    if (!jwt) {
        const response: ResponseBase = {
            isSuccess: false,
            message: 'no jwt found in cookies'
        };
        return NextResponse.json(response);
    }

    const decoded = jsonwebtoken.verify(jwt, process.env.JWT_SECRET!) as DecodedJwtPayload;

    if (!(decoded.userId === userId)) {
        const response: ResponseBase = {
            isSuccess: false,
            message: 'userId is not matching'
        };
        return NextResponse.json(response);
    }

    return NextResponse.next();
}
 
export const config = {
    matcher: ['/api/admin/:path((?!sign-in).*)'],
};
