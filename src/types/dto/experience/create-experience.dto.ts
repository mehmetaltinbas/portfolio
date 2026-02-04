export interface CreateExperienceDto {
    title: string;
    company: string;
    isCurrent: boolean;
    startDate: string;
    endDate?: string;
}
