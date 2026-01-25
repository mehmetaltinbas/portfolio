'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import EditorToolbar from '@/components/EditorToolbar';

export default function PortfolioItemEditor({ 
    initialContent, 
    onContentChange 
}: {
    initialContent?: any;
    onContentChange?: (content: any) => void;
} ) {
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

    if (!editor) return <div>Loading editor...</div>;

    return (
        <div>
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} />
        </div>
    );
}
