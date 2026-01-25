'use client';

import LoadingSpinner from '@/components/LoadingSpinner';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';

export default function PortfolioViewer({ content }: {
    content: object;
}) {
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Image,
            Link,
        ],
        content: content,
        editable: false,
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
            },
        },
    });

    return editor ? (
        <EditorContent editor={editor} />
    ): (
        <LoadingSpinner />
    );
}
