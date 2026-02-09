import { ExperienceRow } from '@/types/db/experience-row';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadAllExperiencesResponse extends ResponseBase {
    experiences?: ExperienceRow[];
}
