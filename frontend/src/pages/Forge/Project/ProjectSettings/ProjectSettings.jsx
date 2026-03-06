import { Box, Typography, TextField, Button, Divider } from '@mui/material'
import { useProject } from '~/hooks/useProject'
import { updateProject } from '~/api/projects'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { styles } from './ProjectSettings.styles'
import { getStyle } from '~/hooks/useStyles'

export default function ProjectSettings() {
  const { id } = useParams()
  const { project, setProject } = useProject() || {}
  const [form, setForm] = useState({ name: '', about: '', version: '' })

  useEffect(() => {
    if (project) {
      const { name, about, version } = project || {}
      setForm({ name, about, version })
    }
  }, [project])

  const handleSave = async () => {
    const updated = await updateProject(id, form)
    if (updated) setProject(updated)
  }

  if (!project) return null

  const { name: formName, about: formAbout, version: formVersion } = form || {}

  return (
    <Box sx={getStyle(styles, 'project-settings')}>
      <Typography variant='h5' gutterBottom>
        Project Settings
      </Typography>
      <Divider sx={getStyle(styles, 'project-settings__divider')} />
      <Box sx={getStyle(styles, 'project-settings__form')}>
        <TextField
          label='Name'
          value={formName}
          onChange={(event) => setForm((prevForm) => ({ ...prevForm, name: event.target.value }))}
        />
        <TextField
          label='About'
          multiline
          rows={3}
          inputProps={{ maxLength: 500 }}
          value={formAbout}
          onChange={(event) => setForm((prevForm) => ({ ...prevForm, about: event.target.value }))}
        />
        <TextField
          label='Version'
          value={formVersion}
          onChange={(event) => setForm((prevForm) => ({ ...prevForm, version: event.target.value }))}
        />
        <Button variant='contained' onClick={handleSave}>
          Save Changes
        </Button>
      </Box>
    </Box>
  )
}

