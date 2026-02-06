import { JsonValue } from "@/generated/client/runtime/library";

export interface CleanUpOrphanedPortfolioImagesDto {
    portfolioItemId: string;
    content: JsonValue;
}
