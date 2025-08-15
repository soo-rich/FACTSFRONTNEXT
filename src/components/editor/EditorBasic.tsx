import type { Editor } from '@tiptap/core'

import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import { Underline } from '@tiptap/extension-underline'
import Divider from '@mui/material/Divider'

import CustomIconButton from '@core/components/mui/IconButton'

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1 p-6">
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className="tabler-bold" />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className="tabler-underline" />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className="tabler-italic" />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className="tabler-strikethrough" />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className="tabler-align-left" />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i className="tabler-align-center" />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i className="tabler-align-right" />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant="outlined"
        size="small"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i className="tabler-align-justified" />
      </CustomIconButton>
    </div>
  )
}

const EditorBasic = ({ value, onChange }: { value?: string, onChange?: (val: string) => void }) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Écris la description ici...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm focus:outline-none max-w-lg min-w-full p-4'
      }
    },

    // content: '<p>Écris la description ici...</p>',

    immediatelyRender: false,
    content: value,
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML())
    }
  })

  return (
    <div className="border rounded-md w-full">
      <EditorToolbar editor={editor} />
      <Divider />
      <EditorContent editor={editor} className="bs-[200px] overflow-y-auto flex" />
    </div>
  )
}


export default EditorBasic
