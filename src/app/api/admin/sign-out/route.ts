import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export async function POST() {
    const cookieOptions: Partial<ResponseCookie> = {
        maxAge: 0, // this expires the cookie immediately
        secure: Boolean(process.env.JWT_IS_SECURE),
        httpOnly: Boolean(process.env.JWT_IS_HTTP_ONLY),
        sameSite: process.env.JWT_SAME_SITE as 'lax' | 'strict' | 'none',
        path: '/', // important: must match the path used when setting
    };

    const cookieStore = await cookies();
    cookieStore.set('jwt', '', cookieOptions);

    return NextResponse.json({ 
        isSuccess: true, 
        message: 'signed out' 
    });
}
