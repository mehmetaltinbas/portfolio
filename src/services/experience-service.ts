import { userId } from "@/constants/user-id.constant";
import { ReadAllExperiencesResponse } from "@/types/response/experience/read-all-experiences-response";
import { prisma } from "prisma/prisma-client";

export const experienceService = {
    async readAllByUserId(): Promise<ReadAllExperiencesResponse> {
        const experiences = await prisma.experience.findMany({ where: { userId }});
        return { isSuccess: true, message: 'all experiences read', experiences };
    }
};
