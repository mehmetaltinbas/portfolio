import { ReadAllEducationsResponse } from "@/types/response/education/read-all-educations-response";
import { prisma } from "prisma/prisma-client";

const userId = process.env.USER_ID;

async function readAllByUserId(): Promise<ReadAllEducationsResponse> {
    const educations = await prisma.education.findMany({ where: { userId }});
    return { isSuccess: true, message: 'all educations read', educations };
}

export const educationService = {
    readAllByUserId,
};
