import { SKILL_NAME_CHAR_LIMIT } from '@/constants/skill-name-char-limit.constant';
import { Skill } from '@/generated/client';
import { GripVertical } from 'lucide-react';

export function SkillDragOverlayPill({ activeSkill }: { activeSkill: Skill }
) {
    return (
        <span 
            className={`
                px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200 flex items-center gap-1.5 shadow-lg select-none
                ${activeSkill.name.length > SKILL_NAME_CHAR_LIMIT / 2 ? 'text-xs' : 'text-sm'}  
            `}>
            <span className="text-gray-400 -ml-1">
                <GripVertical size={14} />
            </span>

            <p className='max-w-[186px] truncate'>
                {activeSkill.name}
            </p>
        </span>
    );
}
