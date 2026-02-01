import { userId } from '@/constants/user-id.constant';
import { ReadAllEducationsResponse } from '@/types/response/education/read-all-educations-response';
import { prisma } from 'prisma/prisma-client';

export const educationService = {
    async readAllByUserId(): Promise<ReadAllEducationsResponse> {
        const educations = await prisma.education.findMany({ where: { userId } });
        return { isSuccess: true, message: 'all educations read', educations };
    },
};
