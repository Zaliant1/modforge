import { useState, useEffect } from 'react'
import { Box, Typography, TextField, Select, MenuItem, FormControl, Fade } from '@mui/material'
import { useNavigate, useParams } from 'react-router-dom'
import { createIssue } from '~/api/issues'
import { getVersions } from '~/api/versions'
import { getPresignedUrl, uploadToR2 } from '~/api/uploads'
import { useProject } from '~/hooks/useProject'
import { useAuth } from '~/hooks/useAuth'
import { RichTextEditor } from '~/components/Common/RichTextEditor/RichTextEditor'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUpload, faCheck, faPaperPlane, faFile } from '@fortawesome/free-solid-svg-icons'
import {
  ISSUE_STATUSES,
  ISSUE_TYPES,
  ISSUE_PRIORITIES,
  OPERATING_SYSTEMS,
  OS_LABEL,
} from '~/constants'
import { styles } from './IssueForm.styles'
import { getStyle, cx } from '~/hooks/useStyles'

const formatLabel = (text) =>
  text.replace('_', ' ').replace(/\b\w/g, (character) => character.toUpperCase())

const PRIORITY_STYLE_MAP = {
  low: 'issue-form__pill--low',
  medium: 'issue-form__pill--medium',
  high: 'issue-form__pill--high',
}

const STATUS_STYLE_MAP = {
  reported: 'issue-form__pill--reported',
  in_progress: 'issue-form__pill--in_progress',
  completed: 'issue-form__pill--completed',
  wont_fix: 'issue-form__pill--wont_fix',
}

const TYPE_STYLE_MAP = {
  bug: 'issue-form__pill--bug',
  suggestion: 'issue-form__pill--suggestion',
}

const REQUIRED_FIELDS = ['summary', 'category', 'version_id', 'type', 'priority', 'status']

export const IssueForm = () => {
  const { id: projectId } = useParams()
  const { project } = useProject() || {}
  const { user } = useAuth() || {}
  const navigate = useNavigate()

  const { members = [], categories = [] } = project || {}
  const { discord_id: discordId } = user || {}
  const [versions, setVersions] = useState([])

  const isVisitor = !members.some((member) => {
    const { discord_id: memberDiscordId } = member || {}
    return memberDiscordId === discordId
  })

  useEffect(() => {
    if (!projectId) return
    getVersions(projectId).then((result) => {
      setVersions(result || [])
    }).catch(() => {})
  }, [projectId])

  const currentVersion = versions.find((version) => {
    const { status: versionStatus } = version || {}
    return versionStatus === 'current'
  })
  const { id: currentVersionId } = currentVersion || {}

  const [form, setForm] = useState({
    summary: '',
    category: categories[0] || '',
    type: 'bug',
    priority: 'medium',
    status: 'reported',
    version_id: '',
    operating_systems: [],
    description: '',
  })

  useEffect(() => {
    if (currentVersionId && !form.version_id) {
      setForm((previousForm) => ({ ...previousForm, version_id: currentVersionId }))
    }
  }, [currentVersionId])

  const [modlogFile, setModlogFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [showOverlay, setShowOverlay] = useState(false)

  const [mounted, setMounted] = useState(false)
  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 50)
    return () => clearTimeout(timer)
  }, [])

  const handleFieldChange = (key, value) => {
    setForm((previousForm) => ({ ...previousForm, [key]: value }))
    setErrors((previousErrors) => {
      const { [key]: _removed, ...remainingErrors } = previousErrors || {}
      const hasRemaining = Object.keys(remainingErrors).length > 0
      if (!hasRemaining) setShowOverlay(false)
      return remainingErrors
    })
  }

  const toggleOperatingSystem = (operatingSystem) =>
    setForm((previousForm) => {
      const { operating_systems: previousOperatingSystems = [] } = previousForm || {}
      return {
        ...previousForm,
        operating_systems: previousOperatingSystems.includes(operatingSystem)
          ? previousOperatingSystems.filter((existingOperatingSystem) => existingOperatingSystem !== operatingSystem)
          : [...previousOperatingSystems, operatingSystem],
      }
    })

  const validate = () => {
    const newErrors = {}
    REQUIRED_FIELDS.forEach((field) => {
      const { [field]: value } = form || {}
      if (!value) newErrors[field] = true
    })
    return newErrors
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      setShowOverlay(true)
      return
    }
    const { description: htmlContent, ...formFields } = form
    const filename = `description-${Date.now()}.html`
    const presigned = await getPresignedUrl(filename, 'text/html')
    if (!presigned) return
    const { upload_url: uploadUrl, public_url: publicUrl } = presigned || {}
    await uploadToR2(uploadUrl, htmlContent, 'text/html')
    const issue = await createIssue(projectId, { ...formFields, description: publicUrl })
    if (issue) {
      const { id: issueId } = issue || {}
      navigate(`/forge/projects/${projectId}/issues/${issueId}`)
    }
  }

  const {
    summary,
    category,
    type,
    priority,
    status,
    version_id: versionId,
    operating_systems: operatingSystems,
    description,
  } = form || {}

  const { name: modlogFileName } = modlogFile || {}

  const hasSummaryError = Boolean(errors.summary)
  const hasCategoryError = Boolean(errors.category)
  const hasVersionError = Boolean(errors.version_id)
  const hasTypeError = Boolean(errors.type)
  const hasPriorityError = Boolean(errors.priority)
  const hasStatusError = Boolean(errors.status)

  return (
    <Box component='form' onSubmit={handleSubmit} sx={getStyle(styles, 'issue-form')}>

      {/* Dim overlay */}
      <Fade in={showOverlay} timeout={300}>
        <Box sx={getStyle(styles, 'issue-form__overlay')} />
      </Fade>

      {/* Main content */}
      <Box sx={getStyle(styles, 'issue-form__main')}>
        <Box sx={getStyle(styles, 'issue-form__header')}>
          <Typography sx={getStyle(styles, 'issue-form__title')}>New Issue</Typography>
        </Box>

        <Fade in={mounted} timeout={400}>
          <Box sx={cx(styles, hasSummaryError && 'issue-form__error-field')}>
            <TextField
              fullWidth
              placeholder='Issue summary *'
              value={summary}
              onChange={(event) => {
                const { value } = event.target || {}
                handleFieldChange('summary', value)
              }}
              inputProps={{ maxLength: 200 }}
              sx={cx(styles, 'issue-form__summary', hasSummaryError && 'issue-form__summary--error')}
              required
            />
            <Typography sx={getStyle(styles, 'issue-form__char-count')}>
              {summary.length}/200
            </Typography>
          </Box>
        </Fade>

        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '80ms' : '0ms' }}>
          <Box sx={getStyle(styles, 'issue-form__editor-section')}>
            <Typography sx={getStyle(styles, 'issue-form__editor-label')}>Description</Typography>
            <Box sx={getStyle(styles, 'issue-form__editor-wrapper')}>
              <RichTextEditor
                value={description}
                onChange={(value) => handleFieldChange('description', value)}
              />
            </Box>
          </Box>
        </Fade>

        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '160ms' : '0ms' }}>
          <Box sx={getStyle(styles, 'issue-form__footer')}>
            <Box
              component='button'
              type='button'
              sx={getStyle(styles, 'issue-form__cancel-button')}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Box>
            <Box component='button' type='submit' sx={getStyle(styles, 'issue-form__submit-button')}>
              <FontAwesomeIcon icon={faPaperPlane} />
              Submit Issue
            </Box>
          </Box>
        </Fade>
      </Box>

      {/* Sidebar */}
      <Box sx={getStyle(styles, 'issue-form__sidebar')}>

        {/* Category */}
        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '100ms' : '0ms' }}>
          <Box sx={cx(styles, hasCategoryError && 'issue-form__error-field')}>
            <Typography sx={cx(styles, 'issue-form__section-label', hasCategoryError && 'issue-form__section-label--error')}>Category *</Typography>
            <FormControl fullWidth size='small' sx={cx(styles, 'issue-form__select', hasCategoryError && 'issue-form__select--error')}>
              <Select
                value={category}
                displayEmpty
                onChange={(event) => {
                  const { value } = event.target || {}
                  handleFieldChange('category', value)
                }}
              >
                {categories.map((categoryOption) => (
                  <MenuItem key={categoryOption} value={categoryOption}>
                    {categoryOption}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Fade>

        {/* Version */}
        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '140ms' : '0ms' }}>
          <Box sx={cx(styles, hasVersionError && 'issue-form__error-field')}>
            <Typography sx={cx(styles, 'issue-form__section-label', hasVersionError && 'issue-form__section-label--error')}>Version *</Typography>
            <FormControl fullWidth size='small' sx={cx(styles, 'issue-form__select', hasVersionError && 'issue-form__select--error')}>
              <Select
                value={versionId}
                displayEmpty
                onChange={(event) => {
                  const { value } = event.target || {}
                  handleFieldChange('version_id', value)
                }}
                disabled={isVisitor}
              >
                {versions.map((version) => {
                  const { id: versionOptionId, name: versionName, status: versionStatus } = version || {}
                  return (
                    <MenuItem key={versionOptionId} value={versionOptionId}>
                      {versionName}{versionStatus === 'current' ? ' (current)' : ''}
                    </MenuItem>
                  )
                })}
              </Select>
            </FormControl>
          </Box>
        </Fade>

        {/* Type */}
        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '180ms' : '0ms' }}>
          <Box sx={cx(styles, hasTypeError && 'issue-form__error-field')}>
            <Typography sx={cx(styles, 'issue-form__section-label', hasTypeError && 'issue-form__section-label--error')}>Type *</Typography>
            <Box sx={cx(styles, 'issue-form__pill-group', hasTypeError && 'issue-form__error-ring')}>
              {ISSUE_TYPES.map((issueType) => {
                const isActive = type === issueType
                return (
                  <Box
                    key={issueType}
                    component='button'
                    type='button'
                    onClick={() => handleFieldChange('type', issueType)}
                    sx={cx(styles, 'issue-form__pill', isActive && (TYPE_STYLE_MAP[issueType] || 'issue-form__pill--active'))}
                  >
                    {formatLabel(issueType)}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Fade>

        {/* Priority */}
        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '220ms' : '0ms' }}>
          <Box sx={cx(styles, hasPriorityError && 'issue-form__error-field')}>
            <Typography sx={cx(styles, 'issue-form__section-label', hasPriorityError && 'issue-form__section-label--error')}>Priority *</Typography>
            <Box sx={cx(styles, 'issue-form__pill-group', hasPriorityError && 'issue-form__error-ring')}>
              {ISSUE_PRIORITIES.map((issuePriority) => {
                const isActive = priority === issuePriority
                const isDisabled = isVisitor
                return (
                  <Box
                    key={issuePriority}
                    component='button'
                    type='button'
                    onClick={() => !isDisabled && handleFieldChange('priority', issuePriority)}
                    sx={cx(
                      styles,
                      'issue-form__pill',
                      isActive && (PRIORITY_STYLE_MAP[issuePriority] || 'issue-form__pill--active'),
                      isDisabled && 'issue-form__pill--disabled',
                    )}
                  >
                    {formatLabel(issuePriority)}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Fade>

        {/* Status */}
        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '260ms' : '0ms' }}>
          <Box sx={cx(styles, hasStatusError && 'issue-form__error-field')}>
            <Typography sx={cx(styles, 'issue-form__section-label', hasStatusError && 'issue-form__section-label--error')}>Status *</Typography>
            <Box sx={cx(styles, 'issue-form__pill-group', hasStatusError && 'issue-form__error-ring')}>
              {ISSUE_STATUSES.map((issueStatus) => {
                const isActive = status === issueStatus
                return (
                  <Box
                    key={issueStatus}
                    component='button'
                    type='button'
                    onClick={() => handleFieldChange('status', issueStatus)}
                    sx={cx(
                      styles,
                      'issue-form__pill',
                      isActive && (STATUS_STYLE_MAP[issueStatus] || 'issue-form__pill--active'),
                    )}
                  >
                    {formatLabel(issueStatus)}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Fade>

        {/* Operating Systems */}
        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '300ms' : '0ms' }}>
          <Box>
            <Typography sx={getStyle(styles, 'issue-form__section-label')}>Operating Systems</Typography>
            <Box sx={getStyle(styles, 'issue-form__os-grid')}>
              {OPERATING_SYSTEMS.map((operatingSystem) => {
                const isActive = operatingSystems.includes(operatingSystem)
                return (
                  <Box
                    key={operatingSystem}
                    component='button'
                    type='button'
                    onClick={() => toggleOperatingSystem(operatingSystem)}
                    sx={cx(styles, 'issue-form__os-item', isActive && 'issue-form__os-item--active')}
                  >
                    <Box sx={cx(styles, 'issue-form__os-check', isActive && 'issue-form__os-check--active')}>
                      {isActive && <FontAwesomeIcon icon={faCheck} />}
                    </Box>
                    {OS_LABEL[operatingSystem] || formatLabel(operatingSystem)}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Fade>

        {/* Modlog upload */}
        <Fade in={mounted} timeout={400} style={{ transitionDelay: mounted ? '340ms' : '0ms' }}>
          <Box>
            <Typography sx={getStyle(styles, 'issue-form__section-label')}>Modlog</Typography>
            <Box component='label' sx={getStyle(styles, 'issue-form__upload')}>
              <FontAwesomeIcon icon={modlogFileName ? faFile : faUpload} style={getStyle(styles, 'issue-form__upload-icon')} />
              {modlogFileName ? (
                <Typography sx={getStyle(styles, 'issue-form__upload-file')}>{modlogFileName}</Typography>
              ) : (
                <Typography sx={getStyle(styles, 'issue-form__upload-text')}>Upload .txt file</Typography>
              )}
              <input
                hidden
                type='file'
                accept='.txt'
                onChange={(event) => {
                  const { target } = event || {}
                  const { files } = target || {}
                  setModlogFile((files && files[0]) || null)
                }}
              />
            </Box>
          </Box>
        </Fade>

      </Box>
    </Box>
  )
}
