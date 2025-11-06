import { ContactRow } from "@/types/db/contact-row";
import { ResponseBase } from "@/types/response/response-base";

export interface ReadAllContactsResponse extends ResponseBase {
    contacts: ContactRow[];
}