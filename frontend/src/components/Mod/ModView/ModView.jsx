import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { useProjects } from '~/context/ProjectsContext'
import { ModCard } from '~/components/Mod/ModCard/ModCard'
import { MOD_TABS } from '~/constants'
import { styles } from './ModView.styles'
import { getStyle, cx } from '~/hooks/useStyles'

export const ModView = () => {
  const { projects = [] } = useProjects() || {}
  const [activeTab, setActiveTab] = useState('All')

  const featured = projects.slice(0, 5)
  const newThisWeek = projects.slice(5)

  return (
    <Box>
      {/* Filter bar */}
      <Box sx={getStyle(styles, 'mod-bar')}>
        <Box component='button' sx={getStyle(styles, 'game-selector-btn')}>
          <Box sx={cx(styles, 'gs-dot', 'gs-dot--active')} />
          All Games
          <Box component='span' sx={getStyle(styles, 'gs-chevron')}>{'\u2304'}</Box>
        </Box>
        <Box sx={getStyle(styles, 'mod-tabs')}>
          {MOD_TABS.map((tab) => {
            const { label, count } = tab || {}
            const isActive = label === activeTab
            return (
              <Box
                key={label}
                sx={cx(styles, 'mod-tab', isActive && 'mod-tab--active')}
                onClick={() => setActiveTab(label)}
              >
                {label}
                {count && (
                  <Box component='span' sx={cx(styles, 'tab-count', isActive && 'tab-count--active')}>
                    {count}
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
        <Box sx={getStyle(styles, 'mod-bar-right')}>
          <Box component='button' sx={getStyle(styles, 'sort-btn')}>
            <FontAwesomeIcon icon={faSort} /> Sort: Downloads {'\u2304'}
          </Box>
        </Box>
      </Box>

      {/* Grid */}
      <Box sx={getStyle(styles, 'mod-grid-wrap')}>
        {/* Featured section */}
        <Box sx={getStyle(styles, 'section-row')}>
          <Box>
            <Typography sx={getStyle(styles, 'section-hl')}>FEATURED MODS</Typography>
            <Typography sx={getStyle(styles, 'section-sub')}>EDITOR&apos;S PICKS {'\u00B7'} UPDATED DAILY</Typography>
          </Box>
          <Typography sx={getStyle(styles, 'see-all')}>See all {'\u2192'}</Typography>
        </Box>
        <Box sx={getStyle(styles, 'mods-grid')}>
          {featured.map((project) => {
            const { id: projectId } = project || {}
            return <ModCard key={projectId} project={project} />
          })}
        </Box>

        {/* New this week */}
        {newThisWeek.length > 0 && (
          <>
            <Box sx={getStyle(styles, 'section-row')}>
              <Box>
                <Typography sx={getStyle(styles, 'section-hl')}>NEW THIS WEEK</Typography>
                <Typography sx={getStyle(styles, 'section-sub')}>{newThisWeek.length} NEW MODS {'\u00B7'} FRESHLY PUBLISHED</Typography>
              </Box>
              <Typography sx={getStyle(styles, 'see-all')}>See all {'\u2192'}</Typography>
            </Box>
            <Box sx={getStyle(styles, 'mods-grid--six')}>
              {newThisWeek.map((project) => {
                const { id: projectId } = project || {}
                return <ModCard key={projectId} project={project} small />
              })}
            </Box>
          </>
        )}
      </Box>
    </Box>
  )
}
