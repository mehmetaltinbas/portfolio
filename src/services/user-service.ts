import { DecodedJwtPayload } from '@/types/decoded-jwt-payload';
import { UpdateUserDto } from '@/types/dto/user/update-user-dto';
import { UserSignInDto } from '@/types/dto/user/user-sign-in-dto';
import { UserSignUpDto } from '@/types/dto/user/user-sign-up-dto';
import { ResponseBase } from '@/types/response/response-base';
import { ReadExtendedUserByIdResponse } from '@/types/response/user/read-extended-user-by-id-response';
import { ReadUserByIdResponse } from '@/types/response/user/read-user-by-id-response';
import { UserSignInResponse } from '@/types/response/user/user-sign-in-response';
import bcrypt from 'bcrypt';
import jsonwebtoken from 'jsonwebtoken';
import { prisma } from 'prisma/prisma-client';

const userId = process.env.USER_ID;

export const userService = {
    async signUp(userSignInDto: UserSignUpDto): Promise<ResponseBase> {
        try {
            const { password, ...restOfDto } = userSignInDto;
            const passwordHash = bcrypt.hashSync(password, 10);
            await prisma.user.create({ data: {
                ...restOfDto,
                passwordHash
            } });
            return { isSuccess: true, message: 'success' };
        } catch (error) {
            console.log(error);
            console.log(JSON.stringify(error, null, 2));
            return { isSuccess: false, message: 'error' };
        }
    },

    async signIn(userSignInDto: UserSignInDto): Promise<UserSignInResponse> {
        const user = await prisma.user.findUnique({ where: {
            userName: userSignInDto.userName
        }});
        if (!user) return { isSuccess: false, message: 'no user found associated with given username'};

        const isMatch = bcrypt.compareSync(userSignInDto.password, user.passwordHash);
        if (!isMatch) return { isSuccess: false, message: 'invalid password' };

        const jwtSecret = process.env.JWT_SECRET;
        const jwtExpiresIn = Number(process.env.JWT_EXPIRES_IN);
        if (!jwtSecret || !jwtExpiresIn) return { isSuccess: false, message: 'secret is undefined'};
        const token = jsonwebtoken.sign({ userId: user.id }, jwtSecret, {
            expiresIn: jwtExpiresIn,
        });

        return { isSuccess: true, message: 'signed in', jwt: token };
    },

    authorize(jwt: string | undefined): ResponseBase {
        if (!jwt) return {
            isSuccess: false,
            message: 'no jwt found in cookies'
        };

        try {
            const decoded = jsonwebtoken.verify(jwt, process.env.JWT_SECRET!) as DecodedJwtPayload;
            if (!(decoded.userId === userId)) return {
                isSuccess: false,
                message: 'userId is not matching'
            };
            return { isSuccess: true, message: 'authorized' };
        } catch (error: any) {
            return { isSuccess: false, message: 'unauthorized' };
        }
    },

    async readById(): Promise<ReadUserByIdResponse> {
        console.log(userId);
        const user = await prisma.user.findUnique({
            where: {
                id: userId,
            }
        });
        if (!user) {
            return { isSuccess: false, message: 'no user found' };
        }
        return {
            isSuccess: true,
            message: 'user read',
            user,
        };
    },

    async readExtendedById(): Promise<ReadExtendedUserByIdResponse> {
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: userId,
                },
                include: {
                    contacts: true,
                    experiences: true,
                    educations: true,
                    portfolioItems: true
                }
            });
            if (!user) {
                return { isSuccess: false, message: 'no user found' };
            }
            return {
                isSuccess: true,
                message: 'user read',
                user,
            };
        } catch(error) {
            console.log(error);
            return { isSuccess: false, message: "couldn't read user" };
        }
    },

    async update(updateUserDto: UpdateUserDto): Promise<ResponseBase> {
        try {
            await prisma.user.update({
                where: {
                    id: userId,
                },
                data: {
                    ...updateUserDto
                },
            });
            return { isSuccess: true, message: 'user updated' };
        } catch(error) {
            return { isSuccess: false, message:  "user couldn't be updated" };
        }
    },
};
