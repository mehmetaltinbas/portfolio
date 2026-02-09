export const jwtCookieSettings = {
    secret: process.env.JWT_SECRET,
    expiresIn: Number(process.env.JWT_EXPIRES_IN),
    isSecure: process.env.JWT_COOKIE_IS_SECURE,
    isHttpOnly: process.env.JWT_COOKIE_IS_HTTP_ONLY,
    sameSite: process.env.JWT_COOKIE_SAME_SITE as 'lax' | 'strict' | 'none',
};
