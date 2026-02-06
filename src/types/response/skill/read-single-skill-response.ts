import { SkillRow } from '@/types/db/skill-row';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadSingleSkillResponse extends ResponseBase {
    skill?: SkillRow;
}
