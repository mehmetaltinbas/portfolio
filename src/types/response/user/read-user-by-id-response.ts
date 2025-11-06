import { UserRow } from '@/types/db/user-row';
import { ResponseBase } from '@/types/response/response-base';

export interface ReadUserByIdResponse extends ResponseBase {
    user?: UserRow;
}
