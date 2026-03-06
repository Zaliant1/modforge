import { useEffect, useState, useRef } from 'react'
import { Box, Typography } from '@mui/material'
import { useParams, useNavigate } from 'react-router-dom'
import { getIssues } from '~/api/issues'
import { useKanban } from '~/context/KanbanContext'
import { useProject } from '~/hooks/useProject'
import { useAuth } from '~/hooks/useAuth'
import { KanbanColumn } from '~/components/Kanban/KanbanColumn/KanbanColumn'
import { KANBAN_COLUMNS, KANBAN_FILTER_TABS, KANBAN_PRIORITY_TABS, KANBAN_SORT_TABS } from '~/constants'
import { styles } from './KanbanBoard.styles'
import { cx } from '~/hooks/useStyles'

export const KanbanBoard = ({ category }) => {
  const { id: projectId } = useParams()
  const navigate = useNavigate()
  const { issues, setIssues, showArchived, setShowArchived } = useKanban() || {}
  const { project } = useProject() || {}
  const { user } = useAuth() || {}
  const [activeFilter, setActiveFilter] = useState('all')
  const [activePriority, setActivePriority] = useState('all')
  const [activeSort, setActiveSort] = useState('newest')
  const [boardFade, setBoardFade] = useState(false)
  const [slidingOut, setSlidingOut] = useState(false)
  const [slidingIn, setSlidingIn] = useState(false)
  const animating = useRef(false)

  const handleArchivedToggle = () => {
    if (animating.current) return
    animating.current = true
    const goingArchived = !showArchived

    // Step 1: fade out cards
    setBoardFade(true)

    setTimeout(() => {
      if (goingArchived) {
        // Step 2: collapse reported/in_progress columns
        setSlidingOut(true)
        setTimeout(() => {
          // Step 3: commit
          setShowArchived(true)
          setSlidingOut(false)
          setBoardFade(false)
          animating.current = false
        }, 400)
      } else {
        // Step 2: show all columns with reported/in_progress collapsed
        setShowArchived(false)
        setSlidingIn(true)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            // Step 3: expand reported/in_progress columns
            setSlidingIn(false)
            setTimeout(() => {
              // Step 4: fade cards in
              setBoardFade(false)
              animating.current = false
            }, 400)
          })
        })
      }
    }, 250)
  }

  const prevSort = useRef(activeSort)
  useEffect(() => {
    if (prevSort.current !== activeSort) {
      prevSort.current = activeSort
      setBoardFade(true)
      setTimeout(() => setBoardFade(false), 200)
    }
  }, [activeSort])

  const { name: projectName = '' } = project || {}
  const { username = '' } = user || {}

  useEffect(() => {
    if (!projectId) return
    const params = category ? { category } : {}
    getIssues(projectId, params)
      .then(setIssues)
      .catch(() => {})
  }, [projectId, category])

  // Issues filtered only by archived status
  const archivedFiltered = issues.filter((issue) => {
    const { archived } = issue || {}
    if (showArchived && !archived) return false
    if (!showArchived && archived) return false
    return true
  })

  // IDs that pass active type/priority/author filters
  const filteredIds = new Set(archivedFiltered.filter((issue) => {
    const { type, priority: issuePriority = '', author = {} } = issue || {}
    const { username: authorName = '' } = author || {}
    if (activeFilter === 'bugs' && type !== 'bug') return false
    if (activeFilter === 'features' && type !== 'suggestion' && type !== 'feature') return false
    if (activeFilter === 'mine' && authorName !== username) return false
    if (activePriority !== 'all' && issuePriority !== activePriority) return false
    return true
  }).map((issue) => {
    const { id } = issue || {}
    return id
  }))

  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

  const sortedIssues = [...archivedFiltered].sort((a, b) => {
    const { created_at: aDate = '', upvotes: aVotes = 0, priority: aPri = '' } = a || {}
    const { created_at: bDate = '', upvotes: bVotes = 0, priority: bPri = '' } = b || {}
    if (activeSort === 'newest') return bDate > aDate ? 1 : -1
    if (activeSort === 'oldest') return aDate > bDate ? 1 : -1
    if (activeSort === 'votes') return bVotes - aVotes
    if (activeSort === 'priority') return (PRIORITY_ORDER[aPri] || 99) - (PRIORITY_ORDER[bPri] || 99)
    return 0
  })

  const archivedCount = issues.filter((issue) => {
    const { archived } = issue || {}
    return archived
  }).length

  return (
    <Box sx={cx(styles, 'kanban-board')}>
      {/* Topbar */}
      <Box sx={cx(styles, 'kanban-board__topbar')}>
        <Box sx={cx(styles, 'kanban-board__breadcrumb')}>
          <Typography component='span' sx={cx(styles, 'kanban-board__bc-item')}>{username}</Typography>
          <Typography component='span' sx={cx(styles, 'kanban-board__bc-sep')}>/</Typography>
          <Typography component='span' sx={cx(styles, 'kanban-board__bc-item')}>{projectName}</Typography>
          <Typography component='span' sx={cx(styles, 'kanban-board__bc-sep')}>/</Typography>
          <Typography component='span' sx={cx(styles, 'kanban-board__bc-active')}>Kanban</Typography>
        </Box>

        <Box sx={cx(styles, 'kanban-board__filters')}>
          {KANBAN_FILTER_TABS.map((tab) => {
            const { key, label, color: tabColor, bg: tabBg, border: tabBorder } = tab || {}
            const isActive = activeFilter === key
            return (
              <Box
                key={key}
                component='button'
                sx={{
                  ...cx(styles, 'kanban-board__tab', isActive && 'kanban-board__tab--active'),
                  ...(isActive ? { color: tabColor, bgcolor: tabBg, border: `1px solid ${tabBorder}` } : {}),
                }}
                onClick={() => setActiveFilter(key)}
              >
                {label}
              </Box>
            )
          })}
          <Box sx={cx(styles, 'kanban-board__filter-sep')} />
          {KANBAN_PRIORITY_TABS.map((tab) => {
            const { key, label, color: tabColor, bg: tabBg, border: tabBorder } = tab || {}
            const isActive = activePriority === key
            return (
              <Box
                key={key}
                component='button'
                sx={{
                  ...cx(styles, 'kanban-board__tab', isActive && 'kanban-board__tab--active'),
                  ...(isActive ? { color: tabColor, bgcolor: tabBg, border: `1px solid ${tabBorder}` } : {}),
                }}
                onClick={() => setActivePriority(key)}
              >
                {label}
              </Box>
            )
          })}
          <Box sx={cx(styles, 'kanban-board__filter-sep')} />
          {KANBAN_SORT_TABS.map((tab) => {
            const { key, label, color: tabColor, bg: tabBg, border: tabBorder } = tab || {}
            const isActive = activeSort === key
            return (
              <Box
                key={key}
                component='button'
                sx={{
                  ...cx(styles, 'kanban-board__tab', isActive && 'kanban-board__tab--active'),
                  ...(isActive ? { color: tabColor, bgcolor: tabBg, border: `1px solid ${tabBorder}` } : {}),
                }}
                onClick={() => setActiveSort(key)}
              >
                {label}
              </Box>
            )
          })}
          <Box sx={cx(styles, 'kanban-board__filter-sep')} />
          <Box
            sx={cx(styles, 'kanban-board__archived-toggle')}
            onClick={handleArchivedToggle}
          >
            <Box sx={cx(styles, 'kanban-board__toggle-track', showArchived && 'kanban-board__toggle-track--on')}>
              <Box sx={cx(styles, 'kanban-board__toggle-thumb', showArchived && 'kanban-board__toggle-thumb--on')} />
            </Box>
            Archived
            <Box component='span' sx={cx(styles, 'kanban-board__archived-num')}>{archivedCount}</Box>
          </Box>
        </Box>

        <Box sx={cx(styles, 'kanban-board__topbar-right')}>
          <Box
            component='button'
            sx={cx(styles, 'kanban-board__btn-accent')}
            onClick={() => navigate(`/forge/projects/${projectId}/issues/new`)}
          >
            &#xFF0B; New Issue
          </Box>
        </Box>
      </Box>

      {/* Board */}
      <Box sx={cx(styles, 'kanban-board__board')}>
        {(showArchived && !slidingOut ? KANBAN_COLUMNS.filter((col) => col.key === 'completed' || col.key === 'wont_fix') : KANBAN_COLUMNS).map((column, columnIndex) => {
          const { key } = column || {}
          const isSliding = (slidingOut || slidingIn) && (key === 'reported' || key === 'in_progress')
          return (
            <KanbanColumn
              key={key}
              column={column}
              columnIndex={columnIndex}
              showCategory={!category}
              cardsFade={boardFade}
              sliding={isSliding}
              filteredIds={filteredIds}
              archived={showArchived}
              issues={sortedIssues.filter((issue) => {
                const { status } = issue || {}
                return status === key
              })}
            />
          )
        })}
      </Box>
    </Box>
  )
}
