import { JsonValue } from '@/generated/client/runtime/library';

export interface CleanUpOrphanedSkillImagesDto {
    skillId: string;
    content: JsonValue;
}
