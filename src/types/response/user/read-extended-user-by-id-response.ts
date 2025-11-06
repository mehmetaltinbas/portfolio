import { ExtendedUserRow } from "@/types/db/extended-user-row";
import { ResponseBase } from "@/types/response/response-base";

export interface ReadExtendedUserByIdResponse extends ResponseBase{
    user?: ExtendedUserRow;
}
