import { ContactRow } from "@/types/db/contact-row";
import { EducationRow } from "@/types/db/education-row";
import { ExperienceRow } from "@/types/db/experience-row";
import { PortfolioItemRow } from "@/types/db/portfolio-item-row";
import { UserRow } from "@/types/db/user-row";

export interface ExtendedUserRow extends UserRow {
    contacts: ContactRow[];
    experiences: ExperienceRow[];
    educations: EducationRow[];
    portfolioItems: PortfolioItemRow[];
}
