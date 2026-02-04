'use client';

import { Button } from '@/components/Button';
import { ExperienceRow } from '@/types/db/experience-row';
import { calculateDuration } from '@/utils/calculate-duration.util';

export function ExperienceItem({
    experience,
    isEditMode,
    onEdit,
    onDelete,
}: {
    experience: ExperienceRow;
    isEditMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
}) {
    const endDate = experience.isCurrent ? new Date() : new Date(experience.endDate!);
    const duration = calculateDuration(experience.startDate, endDate);

    return (
        <div className="flex justify-between items-start">
            <div>
                <p>
                    {experience.title} - {experience.company}
                </p>
                <p className="text-sm text-gray-600">
                    {new Date(experience.startDate).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} -{' '}
                    {experience.isCurrent
                        ? 'Present'
                        : new Date(experience.endDate!).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    {' '}({duration})
                </p>
                <p>{experience.description}</p>
            </div>
            {isEditMode && (
                <div className="flex gap-2">
                    <Button onClick={onEdit}>Edit</Button>
                    <Button
                        className="bg-red-700 border-transparent hover:text-red-700 hover:border-red-700"
                        onClick={onDelete}
                    >
                        Delete
                    </Button>
                </div>
            )}
        </div>
    );
}
