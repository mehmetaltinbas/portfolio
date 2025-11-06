import { UpdateUserDto } from '@/types/dto/user/update-user-dto';
import { UserSignInDto } from '@/types/dto/user/user-sign-in-dto';
import { ResponseBase } from '@/types/response/response-base';
import { ReadExtendedUserByIdResponse } from '@/types/response/user/read-extended-user-by-id-response';
import { ReadUserByIdResponse } from '@/types/response/user/read-user-by-id-response';
import { UserSignInResponse } from '@/types/response/user/user-sign-in-response';
import bcrypt from 'bcrypt';
import { User } from 'generated/prisma/client';
import { PrismaClientKnownRequestError } from 'generated/prisma/internal/prismaNamespace';
import jwt from 'jsonwebtoken';
import { prisma } from 'prisma/prisma-client';

const userId = process.env.USER_ID;

async function signIn(userSignInDto: UserSignInDto): Promise<UserSignInResponse> {
    const user = await prisma.user.findUnique({ where: {
        userName: userSignInDto.userName
    }});
    if (!user) return { isSuccess: false, message: 'no user found associated with given username'};

    const isMatch = bcrypt.compareSync(userSignInDto.password, user.passwordHash);
    if (!isMatch) return { isSuccess: false, message: 'invalid password' };

    const jwtSecret = process.env.JWT_SECRET;
    const jwtExpiresIn = Number(process.env.JWT_EXPIRES_IN);
    if (!jwtSecret || !jwtExpiresIn) return { isSuccess: false, message: 'secret is undefined'};
    const token = jwt.sign({ userId: user.id }, jwtSecret, {
        expiresIn: jwtExpiresIn,
    });

    return { isSuccess: true, message: 'signed in', jwt: token };
}

async function authorize(): Promise<ResponseBase> {
    return { isSuccess: true, message: 'authorized' };
}

async function readById(): Promise<ReadUserByIdResponse> {
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
}

async function readExtendedById(): Promise<ReadExtendedUserByIdResponse> {
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
    // also fetch the educations, experiences.. along with the user data
    if (!user) {
        return { isSuccess: false, message: 'no user found' };
    }
    return {
        isSuccess: true,
        message: 'user read',
        user,
    };
}

async function update(updateUserDto: UpdateUserDto): Promise<ResponseBase> {
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
}

export const userService = {
    signIn,
    authorize,
    readById,
    readExtendedById,
    update,
};
