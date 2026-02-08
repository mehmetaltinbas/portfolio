import { ContactLabel } from '@/enums/contact-label.enum';
import { ExternalLink } from 'lucide-react';
import React from 'react';
import { FaGithub, FaInstagram, FaLinkedinIn, FaXTwitter, FaYoutube } from 'react-icons/fa6';
import { SiUpwork } from 'react-icons/si';

export const contactIconMap: Record<string, React.ReactNode> = {
    [ContactLabel.YOUTUBE]: <FaYoutube />,
    [ContactLabel.INSTAGRAM]: <FaInstagram />,
    [ContactLabel.X]: <FaXTwitter />,
    [ContactLabel.LINKEDIN]: <FaLinkedinIn />,
    [ContactLabel.GITHUB]: <FaGithub />,
    [ContactLabel.UPWORK]: <SiUpwork />,
    [ContactLabel.CUSTOM]: <ExternalLink size={16} />,
};
