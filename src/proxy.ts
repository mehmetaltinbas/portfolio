import { userService } from '@/services/user.service';
import { NextRequest, NextResponse } from 'next/server';
 
export function proxy(request: NextRequest) {
    const jwt = request.cookies.get('jwt')?.value;
    const authorizationResponse = userService.authorize(jwt);
    if (!authorizationResponse.isSuccess) {
        return NextResponse.json(authorizationResponse);
    }
    
    return NextResponse.next();
}
 
export const config = {
    matcher: ['/api/admin/:path((?!sign-in).*)'],
};
