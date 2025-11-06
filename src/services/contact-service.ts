import { ReadAllContactsResponse } from "@/types/response/contact/read-all-contacts-response";
import { prisma } from "prisma/prisma-client";

const userId = process.env.USER_ID;

async function readAllByUserId(): Promise<ReadAllContactsResponse> {
    const contacts = await prisma.contact.findMany({ where: { userId }});
    return { isSuccess: true, message: 'all contacts read', contacts };
}

export const contactService = {
    readAllByUserId,
};
