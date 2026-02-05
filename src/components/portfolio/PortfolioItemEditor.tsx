'use client';

import EditorToolbar from '@/components/EditorToolbar';
import LoadingSpinner from '@/components/LoadingSpinner';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function PortfolioItemEditor({
    initialContent,
    onContentChange,
    portfolioItemId,
    onSave,
    isSaving,
}: {
    initialContent?: any;
    onContentChange?: (content: any) => void;
    portfolioItemId: string;
    onSave?: () => void;
    isSaving?: boolean;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Link.configure({
                openOnClick: false,
            }),
        ],
        content: initialContent || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose mx-auto focus:outline-none min-h-[500px] p-4',
            },
        },
        onUpdate: ({ editor }) => {
            if (onContentChange) {
                onContentChange(editor.getJSON());
            }
        },
    });

    return editor ? (
        <div>
            <EditorToolbar editor={editor} portfolioItemId={portfolioItemId} onSave={onSave} isSaving={isSaving} />
            <EditorContent editor={editor} />
        </div>
    ) : (
        <LoadingSpinner />
    );
}
