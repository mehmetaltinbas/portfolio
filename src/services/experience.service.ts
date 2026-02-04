import { userId } from '@/constants/user-id.constant';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { DeleteExperienceDto } from '@/types/dto/experience/delete-experience.dto';
import { UpdateExperienceDto } from '@/types/dto/experience/update-experience.dto';
import { ReadAllExperiencesResponse } from '@/types/response/experience/read-all-experiences-response';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export const experienceService = {
    async readAllByUserId(): Promise<ReadAllExperiencesResponse> {
        const experiences = await prisma.experience.findMany({ where: { userId } });
        return { isSuccess: true, message: 'all experiences read', experiences };
    },

    async create(dto: CreateExperienceDto): Promise<ResponseBase> {
        await prisma.experience.create({
            data: {
                userId,
                title: dto.title,
                company: dto.company,
                isCurrent: dto.isCurrent,
                startDate: new Date(dto.startDate),
                endDate: dto.isCurrent ? new Date() : new Date(dto.endDate!),
            },
        });
        return { isSuccess: true, message: 'experience created' };
    },

    async update(dto: UpdateExperienceDto): Promise<ResponseBase> {
        const experience = await prisma.experience.findUnique({ where: { id: dto.id } });
        if (!experience) {
            return { isSuccess: false, message: 'experience not found' };
        }

        await prisma.experience.update({
            where: { id: dto.id },
            data: {
                title: dto.title ?? experience.title,
                company: dto.company ?? experience.company,
                isCurrent: dto.isCurrent ?? experience.isCurrent,
                startDate: dto.startDate ? new Date(dto.startDate) : experience.startDate,
                endDate: dto.endDate ? new Date(dto.endDate) : experience.endDate,
            },
        });
        return { isSuccess: true, message: 'experience updated' };
    },

    async delete(dto: DeleteExperienceDto): Promise<ResponseBase> {
        const experience = await prisma.experience.findUnique({ where: { id: dto.id } });
        if (!experience) {
            return { isSuccess: false, message: 'experience not found' };
        }

        await prisma.experience.delete({ where: { id: dto.id } });
        return { isSuccess: true, message: 'experience deleted' };
    },
};
