import { contactIconMap } from '@/constants/contact-icon-map.constant';
import { ContactLabel } from '@/enums/contact-label.enum';
import { ContactRow } from '@/types/db/contact-row';

export function ContactLink({ contact }: { contact: ContactRow }) {
    return (
        <a
            href={contact.value}
            target="_blank"
            rel="noopener noreferrer"
            className="relative group text-gray-600 hover:text-black duration-300 text-lg"
        >
            {contactIconMap[contact.label] ?? contactIconMap[ContactLabel.CUSTOM]}
            <span className="absolute left-8 top-1/2 -translate-y-1/2
                bg-black text-white text-xs px-2 py-1 rounded
                opacity-0 group-hover:opacity-100 transition-opacity duration-100
                pointer-events-none whitespace-nowrap">
                {contact.name}
            </span>
        </a>
    );
}
