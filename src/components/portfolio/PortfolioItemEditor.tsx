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
}: {
    initialContent?: any;
    onContentChange?: (content: any) => void;
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
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none min-h-[500px] p-4',
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
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    ) : (
        <LoadingSpinner />
    );
}
