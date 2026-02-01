import { JsonValue } from '@/generated/client/runtime/library';

export interface UpdatePortfolioItemDto {
    title?: string;
    description?: string;
    content?: JsonValue;
}
