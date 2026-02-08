import { MAX_CONTACTS } from '@/constants/max-contacts.constant';
import { userId } from '@/constants/user-id.constant';
import { CreateContactDto } from '@/types/dto/contact/create-contact.dto';
import { DeleteContactDto } from '@/types/dto/contact/delete-contact.dto';
import { UpdateContactDto } from '@/types/dto/contact/update-contact.dto';
import { ReadAllContactsResponse } from '@/types/response/contact/read-all-contacts-response';
import { ResponseBase } from '@/types/response/response-base';
import { prisma } from 'prisma/prisma-client';

export const contactService = {
    async readAllByUserId(): Promise<ReadAllContactsResponse> {
        const contacts = await prisma.contact.findMany({ where: { userId } });
        return { isSuccess: true, message: 'all contacts read', contacts };
    },

    async create(dto: CreateContactDto): Promise<ResponseBase> {
        const count = await prisma.contact.count({ where: { userId } });
        if (count >= MAX_CONTACTS) {
            return { isSuccess: false, message: `Maximum of ${MAX_CONTACTS} contacts reached` };
        }

        await prisma.contact.create({
            data: {
                userId,
                label: dto.label,
                name: dto.name,
                value: dto.value,
            },
        });
        return { isSuccess: true, message: 'contact created' };
    },

    async update(dto: UpdateContactDto): Promise<ResponseBase> {
        const contact = await prisma.contact.findUnique({ where: { id: dto.id } });
        if (!contact) {
            return { isSuccess: false, message: 'contact not found' };
        }

        await prisma.contact.update({
            where: { id: dto.id },
            data: {
                label: dto.label ?? contact.label,
                name: dto.name ?? contact.name,
                value: dto.value ?? contact.value,
            },
        });
        return { isSuccess: true, message: 'contact updated' };
    },

    async delete(dto: DeleteContactDto): Promise<ResponseBase> {
        const contact = await prisma.contact.findUnique({ where: { id: dto.id } });
        if (!contact) {
            return { isSuccess: false, message: 'contact not found' };
        }

        await prisma.contact.delete({ where: { id: dto.id } });
        return { isSuccess: true, message: 'contact deleted' };
    },
};
