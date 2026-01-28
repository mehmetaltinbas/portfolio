import { userId } from "@/constants/user-id.constant";
import { ReadAllContactsResponse } from "@/types/response/contact/read-all-contacts-response";
import { prisma } from "prisma/prisma-client";

export const contactService = {
    async readAllByUserId(): Promise<ReadAllContactsResponse> {
        const contacts = await prisma.contact.findMany({ where: { userId }});
        return { isSuccess: true, message: 'all contacts read', contacts };
    },
};
