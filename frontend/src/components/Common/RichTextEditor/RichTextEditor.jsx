import { Editor } from '@tinymce/tinymce-react'

export const RichTextEditor = ({ value, onChange }) => {
  return (
    <Editor
      apiKey={import.meta.env.VITE_TINYMCE_API_KEY}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 400,
        menubar: false,
        skin: 'oxide-dark',
        content_css: 'dark',
        plugins: [
          'advlist',
          'autolink',
          'lists',
          'link',
          'image',
          'charmap',
          'preview',
          'anchor',
          'searchreplace',
          'visualblocks',
          'code',
          'fullscreen',
          'insertdatetime',
          'media',
          'table',
          'help',
          'wordcount',
        ],
        toolbar:
          'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat | image | fullscreen | help',
      }}
    />
  )
}

