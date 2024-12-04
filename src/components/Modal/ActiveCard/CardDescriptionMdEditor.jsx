import EditNoteIcon from '@mui/icons-material/EditNote'
import { Box, Button, useColorScheme } from '@mui/material'
import MDEditor from '@uiw/react-md-editor'
import { useState } from 'react'
import rehypeSanitize from 'rehype-sanitize'

const markdownValueExample = `
# Markdown Editor

---

**Hello world!!!**

[![](https://avatars.githubusercontent.com/u/1680273?s=80&v=4)](https://avatars.githubusercontent.com/u/1680273?v=4)

\`\`\`javascript
import React from "react";
import ReactDOM from "react-dom";
import MEDitor from '@uiw/react-md-editor';

\`\`\`
`
const CardDescriptionMdEditor = ({ CardDescriptionProp, handleUpdateCardDescription }) => {
  const { mode } = useColorScheme()
  const [markdownEditMode, setMarkdownEditMode] = useState(false)
  const [cardDescription, setCardDescription] = useState(CardDescriptionProp)

  const updateCardDescription = () => {
    setMarkdownEditMode(false)
    handleUpdateCardDescription(cardDescription)
  }

  return (
    <Box sx={{ mt: -4 }}>
      {markdownEditMode ? (
        <Box sx={{ mt: 5, display: 'flex', flexDirection: 'column', gap: 1 }}>
          <Box data-color-mode={mode}>
            <MDEditor
              value={cardDescription}
              onChange={setCardDescription}
              previewOptions={{ rehypePlugins: [[rehypeSanitize]] }}
              height={400}
              preview='edit'
            />
          </Box>
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={updateCardDescription}
            className='interceptor-loading'
            type='button'
            variant='contained'
            size='small'
            color='info'
          >
            Save
          </Button>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          <Button
            sx={{ alignSelf: 'flex-end' }}
            onClick={() => setMarkdownEditMode(true)}
            type='button'
            variant='contained'
            size='small'
            color='info'
            startIcon={<EditNoteIcon />}
          >
            Edit
          </Button>
          <Box data-color-mode={mode}>
            <MDEditor.Markdown
              source={cardDescription}
              style={{
                whiteSpace: 'pre-wrap',
                padding: cardDescription ? '10px' : '0px',
                border: cardDescription ? '0.5px solid rgba(0, 0, 0, 0.2)' : 'none',
                borderRadius: '8px'
              }}
            ></MDEditor.Markdown>
          </Box>
        </Box>
      )}
    </Box>
  )
}

export default CardDescriptionMdEditor
