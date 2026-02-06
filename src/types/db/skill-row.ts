import { JsonValue } from '@/generated/client/runtime/library';

export interface SkillRow {
    id: string;
    userId: string;
    name: string;
    content: JsonValue;
    order: number;
}
