import { UserRow } from '@/types/db-row/user.row';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadUserByIdResponse extends ResponseBase {
    user?: UserRow;
}
