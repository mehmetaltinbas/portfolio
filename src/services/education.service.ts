import { userId } from '@/constants/user-id.constant';
import { CreateEducationDto } from '@/types/dto/education/create-education.dto';
import { UpdateEducationDto } from '@/types/dto/education/update-education.dto';
import { ReadAllEducationsResponse } from '@/types/response/education/read-all-educations.response';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export class EducationService {
    private constructor() {}

    static async create(dto: CreateEducationDto): Promise<ResponseBase> {
        if (!dto.isCurrent && dto.endDate && dto.endDate < dto.startDate) {
            return { isSuccess: false, message: 'End date cannot be before start date' };
        }

        try {
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
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async readAllByUserId(): Promise<ReadAllEducationsResponse> {
        try {
            const educations = await prisma.education.findMany({
                where: { userId },
                orderBy: [{ isCurrent: 'desc' }, { startDate: 'desc' }],
            });
            return { isSuccess: true, message: 'all educations read', educations };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async updateById(id: string, dto: UpdateEducationDto): Promise<ResponseBase> {
        try {
            const education = await prisma.education.findUnique({ where: { id } });
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
                where: { id },
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
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }

    static async deleteById(id: string): Promise<ResponseBase> {
        try {
            const education = await prisma.education.findUnique({ where: { id } });
            if (!education) {
                return { isSuccess: false, message: 'education not found' };
            }

            await prisma.education.delete({ where: { id } });
            return { isSuccess: true, message: 'education deleted' };
        } catch (error) {
            console.error(error);
            return { isSuccess: false, message: "internal server error" };
        }
    }
}
