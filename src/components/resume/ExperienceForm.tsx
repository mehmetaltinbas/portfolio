'use client';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { CreateExperienceDto } from '@/types/dto/experience/create-experience.dto';
import { ChangeEvent } from 'react';

export function ExperienceForm({
    form,
    onChange,
    onSave,
    onCancel,
    saveLabel,
}: {
    form: Partial<CreateExperienceDto & { id?: string }>;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onCancel: () => void;
    saveLabel: string;
}) {
    return (
        <div className="w-full flex flex-col gap-2 p-4 border rounded-lg">
            <Input
                name="title"
                value={form.title ?? ''}
                onChange={onChange}
                placeholder="Title"
            />
            <Input
                name="company"
                value={form.company ?? ''}
                onChange={onChange}
                placeholder="Company"
            />
            <div className="flex gap-4 items-center">
                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        name="isCurrent"
                        checked={form.isCurrent ?? false}
                        onChange={onChange}
                    />
                    Current
                </label>
            </div>
            <div className="flex gap-2">
                <Input
                    name="startDate"
                    type="date"
                    value={form.startDate ?? ''}
                    onChange={onChange}
                />
                <Input
                    name="endDate"
                    type="date"
                    value={form.endDate ?? ''}
                    onChange={onChange}
                    disabled={form.isCurrent}
                />
            </div>
            <div className="flex gap-2">
                <Button onClick={onSave}>{saveLabel}</Button>
                <Button onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    );
}
