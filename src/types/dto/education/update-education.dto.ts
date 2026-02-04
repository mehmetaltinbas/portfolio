export interface UpdateEducationDto {
    id: string;
    school?: string;
    degree?: string;
    fieldOfStudy?: string;
    description?: string;
    isCurrent?: boolean;
    startDate?: string;
    endDate?: string;
}
