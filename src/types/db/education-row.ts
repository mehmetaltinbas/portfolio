export interface EducationRow {
    id: string;
    userId: string;
    school: string;
    degree: string | null;
    fieldOfStudy: string | null;
    description: string | null;
    isCurrent: boolean;
    startDate: Date;
    endDate: Date | null;
}
