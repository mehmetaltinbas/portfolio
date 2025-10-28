import { User } from 'generated/prisma/client';
import { prisma } from '../../prisma/prisma-client';

async function readById(id: string) {
    await prisma.user.findFirst({
        where: {
            id,
        },
    });
}

async function update(id: string, data: User) {
    await prisma.user.update({
        where: {
            id,
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
