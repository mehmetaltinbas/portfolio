import { PortfolioItemRow } from '@/types/db/portfolio-item-row';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadSinglePortfolioItemResponse extends ResponseBase {
    portfolioItem?: PortfolioItemRow;
}
