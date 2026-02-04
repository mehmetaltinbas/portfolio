export interface ExperienceRow {
    id: string;
    userId: string;
    title: string;
    company: string;
    isCurrent: boolean;
    startDate: Date;
    endDate: Date | null;
}
