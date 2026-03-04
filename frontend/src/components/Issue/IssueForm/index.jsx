import { useState } from 'react'
import {
  Box,
  TextField,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormLabel,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormGroup,
  Button,
  Container,
} from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { createIssue } from '~/api/issues'
import { getPresignedUrl, uploadToR2 } from '~/api/uploads'
import { useProject } from '~/hooks/useProject'
import { useAuth } from '~/hooks/useAuth'
import { RichTextEditor } from '~/components/Common/RichTextEditor'
import {
  ISSUE_STATUSES,
  ISSUE_TYPES,
  ISSUE_PRIORITIES,
  OPERATING_SYSTEMS,
} from '~/constants'
import { styles } from './styles'
import { useStyles } from '~/hooks/useStyles'

const label = (text) =>
  text.replace('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase())

export const IssueForm = () => {
  const { id: projectId } = useParams()
  const { project } = useProject() || {}
  const { user } = useAuth() || {}
  const navigate = useNavigate()

  const { members = [], categories = [], version: projectVersion } = project || {}
  const { discord_id } = user || {}

  const isVisitor = !members.some(
    (member) => member.discord_id === discord_id,
  )

  const [form, setForm] = useState({
    summary: '',
    category: categories[0] || '',
    type: 'bug',
    priority: 'medium',
    status: 'reported',
    version: projectVersion || '',
    operating_systems: [],
    description: '',
  })
  const [modlog, setModlog] = useState(null)

  const set = (key) => (event) =>
    setForm((prevForm) => ({ ...prevForm, [key]: event.target.value }))

  const toggleOS = (operatingSystem) =>
    setForm((prevForm) => {
      const { operating_systems: prevOS = [] } = prevForm || {}
      return {
        ...prevForm,
        operating_systems: prevOS.includes(operatingSystem)
          ? prevOS.filter((existingOperatingSystem) => existingOperatingSystem !== operatingSystem)
          : [...prevOS, operatingSystem],
      }
    })

  const handleSubmit = async (event) => {
    event.preventDefault()
    const { description: htmlContent, ...rest } = form
    const filename = `description-${Date.now()}.html`
    const presigned = await getPresignedUrl(filename, 'text/html')
    if (!presigned) return
    const { upload_url, public_url } = presigned || {}
    await uploadToR2(upload_url, htmlContent, 'text/html')
    const issue = await createIssue(projectId, { ...rest, description: public_url })
    if (issue) {
      const { id: issueId } = issue || {}
      navigate(`/projects/${projectId}/issues/${issueId}`)
    }
  }

  const { summary, category, type, priority, status, operating_systems, description } = form || {}

  return (
    <Container maxWidth='lg'>
      <Box component='form' onSubmit={handleSubmit}>
        <TextField
          fullWidth
          placeholder='Summary *'
          value={summary}
          onChange={set('summary')}
          inputProps={{ maxLength: 200 }}
          sx={useStyles(styles, 'issue-form__summary')}
          required
        />

        <Box sx={useStyles(styles, 'issue-form__fields')}>
          <FormControl size='small' sx={useStyles(styles, 'issue-form__category')}>
            <InputLabel>Category *</InputLabel>
            <Select
              value={category}
              label='Category *'
              onChange={set('category')}
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <FormLabel>Type</FormLabel>
            <RadioGroup value={type} onChange={set('type')}>
              {ISSUE_TYPES.map((issueType) => (
                <FormControlLabel
                  key={issueType}
                  value={issueType}
                  control={<Radio size='small' />}
                  label={label(issueType)}
                />
              ))}
            </RadioGroup>
          </Box>

          <Box>
            <FormLabel>Priority</FormLabel>
            <RadioGroup value={priority} onChange={set('priority')}>
              {ISSUE_PRIORITIES.map((issuePriority) => (
                <FormControlLabel
                  key={issuePriority}
                  value={issuePriority}
                  control={<Radio size='small' />}
                  label={`${label(issuePriority)} Priority`}
                  disabled={isVisitor}
                />
              ))}
            </RadioGroup>
          </Box>

          <Box>
            <FormLabel>Status</FormLabel>
            <RadioGroup value={status} onChange={set('status')}>
              {ISSUE_STATUSES.map((issueStatus) => (
                <FormControlLabel
                  key={issueStatus}
                  value={issueStatus}
                  control={<Radio size='small' />}
                  label={label(issueStatus)}
                />
              ))}
            </RadioGroup>
          </Box>

          <Box>
            <FormLabel>Operating System</FormLabel>
            <FormGroup>
              {OPERATING_SYSTEMS.map((operatingSystem) => (
                <FormControlLabel
                  key={operatingSystem}
                  control={
                    <Checkbox
                      size='small'
                      checked={operating_systems.includes(operatingSystem)}
                      onChange={() => toggleOS(operatingSystem)}
                    />
                  }
                  label={label(operatingSystem)}
                />
              ))}
            </FormGroup>
          </Box>
        </Box>

        <RichTextEditor
          value={description}
          onChange={(value) => setForm((prevForm) => ({ ...prevForm, description: value }))}
        />

        <Box sx={useStyles(styles, 'issue-form__footer')}>
          <Button variant='outlined' component='label'>
            Upload Modlogs
            <input
              hidden
              type='file'
              accept='.txt'
              onChange={(event) => setModlog(event.target.files && event.target.files[0] || null)}
            />
          </Button>
          <Button type='submit' variant='contained'>
            Submit →
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

