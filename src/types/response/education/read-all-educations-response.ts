import { EducationRow } from "@/types/db/education-row";
import { ResponseBase } from "@/types/response/response-base";

export interface ReadAllEducationsResponse extends ResponseBase {
    educations: EducationRow[];
}
