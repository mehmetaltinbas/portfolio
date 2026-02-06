import { userId } from '@/constants/user-id.constant';
import { Prisma, PrismaClient } from '@/generated/client';
import { CreateSkillDto } from '@/types/dto/skill/create-skill.dto';
import { UpdateSkillDto } from '@/types/dto/skill/update-skill.dto';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

type TransactionClient = Omit<PrismaClient, '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'>;

export const skillService = {
    async create(dto: CreateSkillDto): Promise<ResponseBase> {
        try {
            await prisma.$transaction(async (tx: TransactionClient) => {
                await tx.skill.updateMany({
                    where: { userId },
                    data: { order: { increment: 1 } },
                });

                await tx.skill.create({
                    data: {
                        userId,
                        name: dto.name,
                        order: 0,
                        content: Prisma.JsonNull,
                    },
                });
            });

            return { isSuccess: true, message: 'skill created' };
        } catch {
            return { isSuccess: false, message: "skill couldn't be created" };
        }
    },

    async updateById(id: string, dto: UpdateSkillDto): Promise<ResponseBase> {
        try {
            const skill = await prisma.skill.findUnique({ where: { id } });
            if (!skill) {
                return { isSuccess: false, message: 'skill not found' };
            }

            await prisma.skill.update({
                where: { id },
                data: {
                    name: dto.name ?? skill.name,
                    content: dto.content !== undefined ? (dto.content as Prisma.InputJsonValue) : undefined,
                    order: dto.order ?? skill.order,
                },
            });

            return { isSuccess: true, message: 'skill updated' };
        } catch {
            return { isSuccess: false, message: "skill couldn't be updated" };
        }
    },

    async deleteById(id: string): Promise<ResponseBase> {
        try {
            const skill = await prisma.skill.findUnique({ where: { id } });
            if (!skill) {
                return { isSuccess: false, message: 'skill not found' };
            }

            await prisma.$transaction(async (tx: TransactionClient) => {
                await tx.skill.delete({ where: { id } });

                await tx.skill.updateMany({
                    where: {
                        userId: skill.userId,
                        order: { gt: skill.order },
                    },
                    data: {
                        order: { decrement: 1 },
                    },
                });
            });

            return { isSuccess: true, message: 'skill deleted' };
        } catch {
            return { isSuccess: false, message: "skill couldn't be deleted" };
        }
    },
};
