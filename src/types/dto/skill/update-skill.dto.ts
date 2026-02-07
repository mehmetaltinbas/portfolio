import { JsonValue } from '@/generated/client/runtime/library';

export interface UpdateSkillDto {
    id: string;
    name?: string;
    content?: JsonValue;
}
