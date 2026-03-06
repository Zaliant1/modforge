import { useRef, useCallback, useEffect } from 'react'
import { Box } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faBold,
  faItalic,
  faUnderline,
  faStrikethrough,
  faListUl,
  faListOl,
  faQuoteLeft,
  faCode,
  faLink,
  faUnlink,
  faAlignLeft,
  faAlignCenter,
  faAlignRight,
  faUndo,
  faRedo,
  faMinus,
  faImage,
  faVideo,
} from '@fortawesome/free-solid-svg-icons'
import { styles } from './RichTextEditor.styles'
import { getStyle, cx } from '~/hooks/useStyles'

const TOOLBAR_GROUPS = [
  {
    key: 'history',
    buttons: [
      { command: 'undo', icon: faUndo, label: 'Undo' },
      { command: 'redo', icon: faRedo, label: 'Redo' },
    ],
  },
  {
    key: 'block',
    select: {
      command: 'formatBlock',
      options: [
        { value: 'p', label: 'Paragraph' },
        { value: 'h1', label: 'Heading 1' },
        { value: 'h2', label: 'Heading 2' },
        { value: 'h3', label: 'Heading 3' },
        { value: 'pre', label: 'Code Block' },
      ],
    },
  },
  {
    key: 'inline',
    buttons: [
      { command: 'bold', icon: faBold, label: 'Bold' },
      { command: 'italic', icon: faItalic, label: 'Italic' },
      { command: 'underline', icon: faUnderline, label: 'Underline' },
      { command: 'strikeThrough', icon: faStrikethrough, label: 'Strikethrough' },
      { command: 'insertInlineCode', icon: faCode, label: 'Inline Code' },
    ],
  },
  {
    key: 'list',
    buttons: [
      { command: 'insertUnorderedList', icon: faListUl, label: 'Bullet List' },
      { command: 'insertOrderedList', icon: faListOl, label: 'Numbered List' },
      { command: 'blockquote', icon: faQuoteLeft, label: 'Blockquote' },
    ],
  },
  {
    key: 'align',
    buttons: [
      { command: 'justifyLeft', icon: faAlignLeft, label: 'Align Left' },
      { command: 'justifyCenter', icon: faAlignCenter, label: 'Align Center' },
      { command: 'justifyRight', icon: faAlignRight, label: 'Align Right' },
    ],
  },
  {
    key: 'insert',
    buttons: [
      { command: 'createLink', icon: faLink, label: 'Insert Link' },
      { command: 'unlink', icon: faUnlink, label: 'Remove Link' },
      { command: 'insertHorizontalRule', icon: faMinus, label: 'Horizontal Rule' },
    ],
  },
  {
    key: 'media',
    buttons: [
      { command: 'insertImage', icon: faImage, label: 'Insert Image' },
      { command: 'insertVideo', icon: faVideo, label: 'Embed Video' },
    ],
  },
]

const isCommandActive = (command) => {
  try {
    return document.queryCommandState(command)
  } catch {
    return false
  }
}

const YOUTUBE_REGEX = /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
const VIMEO_REGEX = /vimeo\.com\/(\d+)/

const buildVideoEmbed = (url) => {
  const youtubeMatch = url.match(YOUTUBE_REGEX)
  if (youtubeMatch) {
    const videoId = youtubeMatch[1]
    return `<div class="rte-video-wrapper"><iframe src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe></div>`
  }
  const vimeoMatch = url.match(VIMEO_REGEX)
  if (vimeoMatch) {
    const videoId = vimeoMatch[1]
    return `<div class="rte-video-wrapper"><iframe src="https://player.vimeo.com/video/${videoId}" frameborder="0" allowfullscreen></iframe></div>`
  }
  return `<div class="rte-video-wrapper"><video src="${url.replace(/"/g, '&quot;')}" controls style="max-width:100%;border-radius:6px;"></video></div>`
}

export const RichTextEditor = ({ value, onChange }) => {
  const editorReference = useRef(null)
  const isInternalChange = useRef(false)

  useEffect(() => {
    const { current: editorElement } = editorReference || {}
    if (!editorElement) return
    if (isInternalChange.current) {
      isInternalChange.current = false
      return
    }
    if (editorElement.innerHTML !== value) {
      editorElement.innerHTML = value || ''
    }
  }, [value])

  const handleInput = useCallback(() => {
    const { current: editorElement } = editorReference || {}
    if (!editorElement || !onChange) return
    isInternalChange.current = true
    onChange(editorElement.innerHTML)
  }, [onChange])

  const executeCommand = useCallback((command, commandValue) => {
    const { current: editorElement } = editorReference || {}
    if (!editorElement) return

    editorElement.focus()

    if (command === 'formatBlock') {
      document.execCommand('formatBlock', false, `<${commandValue}>`)
    } else if (command === 'blockquote') {
      document.execCommand('formatBlock', false, '<blockquote>')
    } else if (command === 'createLink') {
      const url = window.prompt('Enter URL:')
      if (url) {
        document.execCommand('createLink', false, url)
      }
    } else if (command === 'insertImage') {
      const imageUrl = window.prompt('Enter image URL:')
      if (imageUrl) {
        document.execCommand('insertHTML', false, `<img src="${imageUrl.replace(/"/g, '&quot;')}" alt="image" style="max-width:100%;border-radius:6px;" />`)
      }
    } else if (command === 'insertVideo') {
      const videoUrl = window.prompt('Enter video URL (YouTube, Vimeo, or direct):')
      if (videoUrl) {
        const embedHtml = buildVideoEmbed(videoUrl)
        if (embedHtml) {
          document.execCommand('insertHTML', false, embedHtml)
        }
      }
    } else if (command === 'insertInlineCode') {
      const selection = window.getSelection()
      const { rangeCount } = selection || {}
      if (rangeCount && rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const selectedText = range.toString()
        if (selectedText) {
          const codeElement = document.createElement('code')
          range.surroundContents(codeElement)
        }
      }
    } else {
      document.execCommand(command, false, commandValue || null)
    }

    handleInput()
  }, [handleInput])

  const handleKeyDown = useCallback((event) => {
    const { key, ctrlKey, metaKey } = event || {}
    const hasModifier = ctrlKey || metaKey

    if (hasModifier && key === 'b') {
      event.preventDefault()
      executeCommand('bold')
    } else if (hasModifier && key === 'i') {
      event.preventDefault()
      executeCommand('italic')
    } else if (hasModifier && key === 'u') {
      event.preventDefault()
      executeCommand('underline')
    }
  }, [executeCommand])

  const insertImageFile = useCallback((file) => {
    const reader = new FileReader()
    reader.onload = (readerEvent) => {
      const { result: dataUrl } = (readerEvent || {}).target || {}
      if (dataUrl) {
        const { current: editorElement } = editorReference || {}
        if (editorElement) editorElement.focus()
        document.execCommand('insertHTML', false, `<img src="${dataUrl}" alt="image" style="max-width:100%;border-radius:6px;" />`)
        handleInput()
      }
    }
    reader.readAsDataURL(file)
  }, [handleInput])

  const handlePaste = useCallback((event) => {
    const { clipboardData } = event || {}
    const { items } = clipboardData || {}
    if (!items) return
    for (let index = 0; index < items.length; index++) {
      const item = items[index]
      const { type: itemType } = item || {}
      if (itemType && itemType.startsWith('image/')) {
        event.preventDefault()
        const file = item.getAsFile()
        if (file) insertImageFile(file)
        return
      }
    }
  }, [insertImageFile])

  const handleDrop = useCallback((event) => {
    const { dataTransfer } = event || {}
    const { files } = dataTransfer || {}
    if (!files || files.length === 0) return
    const file = files[0]
    const { type: fileType } = file || {}
    if (fileType && fileType.startsWith('image/')) {
      event.preventDefault()
      insertImageFile(file)
    }
  }, [insertImageFile])

  const handleBlockSelect = useCallback((event) => {
    const { value: selectedValue } = (event || {}).target || {}
    if (selectedValue) {
      executeCommand('formatBlock', selectedValue)
    }
  }, [executeCommand])

  return (
    <Box sx={getStyle(styles, 'rte')}>
      <Box sx={getStyle(styles, 'rte__toolbar')}>
        {TOOLBAR_GROUPS.map((group) => {
          const { key: groupKey, buttons, select } = group || {}
          return (
            <Box key={groupKey} sx={getStyle(styles, 'rte__toolbar-group')}>
              {select && (
                <Box
                  component='select'
                  onChange={handleBlockSelect}
                  defaultValue='p'
                  sx={getStyle(styles, 'rte__toolbar-select')}
                >
                  {(select.options || []).map((option) => {
                    const { value: optionValue, label: optionLabel } = option || {}
                    return (
                      <option key={optionValue} value={optionValue}>
                        {optionLabel}
                      </option>
                    )
                  })}
                </Box>
              )}
              {(buttons || []).map((button) => {
                const { command, icon, label } = button || {}
                const isActive = isCommandActive(command)
                return (
                  <Box
                    key={command}
                    component='button'
                    type='button'
                    title={label}
                    onClick={() => executeCommand(command)}
                    sx={cx(styles, 'rte__toolbar-button', isActive && 'rte__toolbar-button--active')}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </Box>
                )
              })}
            </Box>
          )
        })}
      </Box>
      <Box
        ref={editorReference}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        sx={getStyle(styles, 'rte__content')}
      />
    </Box>
  )
}
