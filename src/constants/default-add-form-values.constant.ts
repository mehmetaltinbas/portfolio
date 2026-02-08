import { ContactLabel } from "@/enums/contact-label.enum";
import { ContactFormData } from "@/types/contact-form-data.interface";

export const DEFAULT_ADD_FORM: ContactFormData = { label: ContactLabel.CUSTOM, name: '', value: '' };
