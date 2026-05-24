"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import { Bold, Italic, Strikethrough, Heading1, Heading2, Quote, AlignLeft, AlignCenter, AlignRight, Type, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

const FONTS = [
  { name: 'Serif', value: 'font-serif' },
  { name: 'Sans', value: 'font-sans' },
  { name: 'Mono', value: 'font-mono' },
];

export default function TiptapEditor({ content, onChange }: { content: string, onChange: (html: string) => void }) {
  const [isToolbookOpen, setIsToolbookOpen] = useState(false);
  const [position, setPosition] = useState({ x: 20, y: window.innerHeight - 100 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number, startY: number, initialX: number, initialY: number } | null>(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content,
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-lg md:prose-xl max-w-none focus:outline-none min-h-[50vh] leading-relaxed',
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      setPosition({
        x: Math.min(Math.max(0, dragRef.current.initialX + dx), window.innerWidth - 60),
        y: Math.min(Math.max(0, dragRef.current.initialY + dy), window.innerHeight - 60)
      });
    };
    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!editor) return null;

  return (
    <div className="relative w-full">
      <EditorContent editor={editor} />

      {/* Floating Toolbook */}
      <div 
        className="fixed z-50 transition-transform"
        style={{ left: position.x, top: position.y }}
      >
        {!isToolbookOpen ? (
          <button
            onPointerDown={(e) => {
              dragRef.current = { startX: e.clientX, startY: e.clientY, initialX: position.x, initialY: position.y };
              setIsDragging(true);
            }}
            onClick={() => { if (!isDragging) setIsToolbookOpen(true); }}
            className="w-14 h-14 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] flex items-center justify-center cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
            title="Open Toolbook"
          >
            <Type size={24} />
          </button>
        ) : (
          <div className="bg-[#1a1a1a] border border-white/10 p-4 rounded-3xl shadow-2xl flex flex-col gap-4 w-64 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center border-b border-white/5 pb-2">
              <span className="text-[10px] uppercase tracking-widest text-brand-soft">Toolbook</span>
              <button onClick={() => setIsToolbookOpen(false)} className="text-white/50 hover:text-white"><X size={16}/></button>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button onClick={() => editor.chain().focus().toggleBold().run()} className={`p-2 rounded-xl ${editor.isActive('bold') ? 'bg-white text-black' : 'hover:bg-white/10 text-white'}`}><Bold size={18}/></button>
              <button onClick={() => editor.chain().focus().toggleItalic().run()} className={`p-2 rounded-xl ${editor.isActive('italic') ? 'bg-white text-black' : 'hover:bg-white/10 text-white'}`}><Italic size={18}/></button>
              <button onClick={() => editor.chain().focus().toggleStrike().run()} className={`p-2 rounded-xl ${editor.isActive('strike') ? 'bg-white text-black' : 'hover:bg-white/10 text-white'}`}><Strikethrough size={18}/></button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`p-2 rounded-xl ${editor.isActive('heading', { level: 1 }) ? 'bg-brand-accent text-black' : 'hover:bg-white/10 text-white'}`}><Heading1 size={18}/></button>
              <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`p-2 rounded-xl ${editor.isActive('heading', { level: 2 }) ? 'bg-brand-accent text-black' : 'hover:bg-white/10 text-white'}`}><Heading2 size={18}/></button>
              <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={`p-2 rounded-xl ${editor.isActive('blockquote') ? 'bg-brand-accent text-black' : 'hover:bg-white/10 text-white'}`}><Quote size={18}/></button>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={`p-2 rounded-xl ${editor.isActive({ textAlign: 'left' }) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white'}`}><AlignLeft size={18}/></button>
              <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={`p-2 rounded-xl ${editor.isActive({ textAlign: 'center' }) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white'}`}><AlignCenter size={18}/></button>
              <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={`p-2 rounded-xl ${editor.isActive({ textAlign: 'right' }) ? 'bg-white/20 text-white' : 'hover:bg-white/10 text-white'}`}><AlignRight size={18}/></button>
            </div>
            
            {/* Note: We will handle full post fonts at the wrapper level in WriteEditorClient, this just formats content */}
          </div>
        )}
      </div>
    </div>
  );
}
