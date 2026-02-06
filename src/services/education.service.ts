import { userId } from '@/constants/user-id.constant';
import { CreateEducationDto } from '@/types/dto/education/create-education.dto';
import { DeleteEducationDto } from '@/types/dto/education/delete-education.dto';
import { UpdateEducationDto } from '@/types/dto/education/update-education.dto';
import { ReadAllEducationsResponse } from '@/types/response/education/read-all-educations-response';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export const educationService = {
    async readAllByUserId(): Promise<ReadAllEducationsResponse> {
        const educations = await prisma.education.findMany({
            where: { userId },
            orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
        });
        return { isSuccess: true, message: 'all educations read', educations };
    },

    async create(dto: CreateEducationDto): Promise<ResponseBase> {
        if (!dto.isCurrent && dto.endDate && dto.endDate < dto.startDate) {
            return { isSuccess: false, message: 'End date cannot be before start date' };
        }

        await prisma.education.create({
            data: {
                userId,
                school: dto.school,
                degree: dto.degree,
                fieldOfStudy: dto.fieldOfStudy,
                description: dto.description,
                isCurrent: dto.isCurrent,
                startDate: new Date(dto.startDate + '-01'),
                endDate: dto.isCurrent ? null : new Date(dto.endDate + '-01'),
            },
        });
        return { isSuccess: true, message: 'education created' };
    },

    async update(dto: UpdateEducationDto): Promise<ResponseBase> {
        const education = await prisma.education.findUnique({ where: { id: dto.id } });
        if (!education) {
            return { isSuccess: false, message: 'education not found' };
        }

        const startDate = dto.startDate ?? education.startDate.toISOString().slice(0, 7);
        const endDate = dto.endDate ?? (education.endDate ? education.endDate.toISOString().slice(0, 7) : undefined);
        const isCurrent = dto.isCurrent ?? education.isCurrent;

        if (!isCurrent && endDate && endDate < startDate) {
            return { isSuccess: false, message: 'End date cannot be before start date' };
        }

        await prisma.education.update({
            where: { id: dto.id },
            data: {
                school: dto.school ?? education.school,
                degree: dto.degree ?? education.degree,
                fieldOfStudy: dto.fieldOfStudy ?? education.fieldOfStudy,
                description: dto.description ?? education.description,
                isCurrent: dto.isCurrent ?? education.isCurrent,
                startDate: dto.startDate ? new Date(dto.startDate + '-01') : education.startDate,
                endDate: dto.isCurrent ? null : dto.endDate ? new Date(dto.endDate + '-01') : education.endDate,
            },
        });
        return { isSuccess: true, message: 'education updated' };
    },

    async delete(dto: DeleteEducationDto): Promise<ResponseBase> {
        const education = await prisma.education.findUnique({ where: { id: dto.id } });
        if (!education) {
            return { isSuccess: false, message: 'education not found' };
        }

        await prisma.education.delete({ where: { id: dto.id } });
        return { isSuccess: true, message: 'education deleted' };
    },
};
