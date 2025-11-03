import { User } from 'generated/prisma/client';
import { ReadUserByIdResponse } from '@/types/response/read-user-by-id-response';
import { prisma } from 'prisma/prisma-client';
import bcrypt from 'bcrypt';

const userId = process.env.USER_ID;

async function readById(): Promise<ReadUserByIdResponse> {
    const user = await prisma.user.findFirst({
        where: {
            id: userId,
        },
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

async function update(data: User) {
    await prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            userName: 'bmlmcdbşl',
        },
    });
}

export const userService = {
    readById,
    update,
};
