import { useState } from 'react'
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  Chip,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Header } from '~/layout/Header'
import { createProject } from '~/api/projects'
import { styles } from './ProjectEdit.styles'
import { useStyles } from '~/hooks/useStyles'

export default function ProjectEdit() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '',
    about: '',
    version: '',
    categories: [],
    is_public: true,
  })
  const [categoryInput, setCategoryInput] = useState('')

  const addCategory = () => {
    const trimmed = categoryInput.trim()
    const { categories = [] } = form || {}
    if (trimmed && !categories.includes(trimmed)) {
      setForm((prevForm) => {
        const { categories: prevCategories = [] } = prevForm || {}
        return { ...prevForm, categories: [...prevCategories, trimmed] }
      })
      setCategoryInput('')
    }
  }

  const removeCategory = (category) => {
    setForm((prevForm) => {
      const { categories: prevCategories = [] } = prevForm || {}
      return { ...prevForm, categories: prevCategories.filter((existingCategory) => existingCategory !== category) }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const project = await createProject(form)
    if (project) {
      const { id: projectId } = project || {}
      navigate(`/forge/projects/${projectId}`)
    }
  }

  const { name: formName, about: formAbout, categories: formCategories = [], version: formVersion, is_public: formIsPublic } = form || {}

  return (
    <Box sx={useStyles(styles, 'project-edit')}>
      <Header />
      <Container maxWidth='sm' sx={useStyles(styles, 'project-edit__container')}>
        <Typography variant='h5' gutterBottom>
          Create Project
        </Typography>
        <Box
          component='form'
          onSubmit={handleSubmit}
          sx={useStyles(styles, 'project-edit__form')}
        >
          <TextField
            label='Name'
            required
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
            helperText={`${formAbout.length}/500`}
          />
          <TextField
            label='Initial Version'
            placeholder='e.g. 1.0.0'
            value={formVersion}
            onChange={(event) =>
              setForm((prevForm) => ({ ...prevForm, version: event.target.value }))
            }
          />
          <Box>
            <Box sx={useStyles(styles, 'project-edit__category-row')}>
              <TextField
                label='Add Category'
                size='small'
                value={categoryInput}
                onChange={(event) => setCategoryInput(event.target.value)}
                onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), addCategory())}
              />
              <Button variant='outlined' onClick={addCategory}>
                Add
              </Button>
            </Box>
            <Box sx={useStyles(styles, 'project-edit__chips')}>
              {formCategories.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  onDelete={() => removeCategory(category)}
                />
              ))}
            </Box>
          </Box>
          <FormControlLabel
            control={
              <Switch
                checked={formIsPublic}
                onChange={(event) =>
                  setForm((prevForm) => ({ ...prevForm, is_public: event.target.checked }))
                }
              />
            }
            label='Public'
          />
          <Button
            type='submit'
            variant='contained'
            disabled={!formName || formCategories.length === 0}
          >
            Create
          </Button>
        </Box>
      </Container>
    </Box>
  )
}
