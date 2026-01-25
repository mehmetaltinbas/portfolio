import { JsonValue } from "@/generated/client/runtime/library";

export interface PortfolioItemRow {
    id: string;
    userId: string;
    title: string;
    description: string;
    content: JsonValue;
}
