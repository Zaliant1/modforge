import { useState } from 'react'
import { Box, Typography } from '@mui/material'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSort } from '@fortawesome/free-solid-svg-icons'
import { useProjects } from '~/context/ProjectsContext'
import { ModCard } from '~/components/Mod/ModCard/ModCard'
import { MOD_TABS } from '~/constants'
import { styles } from './ModView.styles'
import { useStyles } from '~/hooks/useStyles'

export const ModView = () => {
  const { projects = [] } = useProjects() || {}
  const [activeTab, setActiveTab] = useState('All')

  const featured = projects.slice(0, 5)
  const newThisWeek = projects.slice(5)

  return (
    <Box>
      {/* Filter bar */}
      <Box sx={useStyles(styles, 'mod-bar')}>
        <Box component='button' sx={useStyles(styles, 'game-selector-btn')}>
          <Box sx={{ ...useStyles(styles, 'gs-dot'), ...useStyles(styles, 'gs-dot--active') }} />
          All Games
          <Box component='span' sx={useStyles(styles, 'gs-chevron')}>{'\u2304'}</Box>
        </Box>
        <Box sx={useStyles(styles, 'mod-tabs')}>
          {MOD_TABS.map((tab) => {
            const { label, count } = tab || {}
            const isActive = label === activeTab
            return (
              <Box
                key={label}
                sx={useStyles(styles, isActive ? 'mod-tab--active' : 'mod-tab')}
                onClick={() => setActiveTab(label)}
              >
                {label}
                {count && (
                  <Box component='span' sx={useStyles(styles, isActive ? 'tab-count--active' : 'tab-count')}>
                    {count}
                  </Box>
                )}
              </Box>
            )
          })}
        </Box>
        <Box sx={useStyles(styles, 'mod-bar-right')}>
          <Box component='button' sx={useStyles(styles, 'sort-btn')}>
            <FontAwesomeIcon icon={faSort} /> Sort: Downloads {'\u2304'}
          </Box>
        </Box>
      </Box>

      {/* Grid */}
      <Box sx={useStyles(styles, 'mod-grid-wrap')}>
        {/* Featured section */}
        <Box sx={useStyles(styles, 'section-row')}>
          <Box>
            <Typography sx={useStyles(styles, 'section-hl')}>FEATURED MODS</Typography>
            <Typography sx={useStyles(styles, 'section-sub')}>EDITOR'S PICKS {'\u00B7'} UPDATED DAILY</Typography>
          </Box>
          <Typography sx={useStyles(styles, 'see-all')}>See all {'\u2192'}</Typography>
        </Box>
        <Box sx={useStyles(styles, 'mods-grid')}>
          {featured.map((project) => {
            const { id: projectId } = project || {}
            return <ModCard key={projectId} project={project} />
          })}
        </Box>

        {/* New this week */}
        {newThisWeek.length > 0 && (
          <>
            <Box sx={useStyles(styles, 'section-row')}>
              <Box>
                <Typography sx={useStyles(styles, 'section-hl')}>NEW THIS WEEK</Typography>
                <Typography sx={useStyles(styles, 'section-sub')}>{newThisWeek.length} NEW MODS {'\u00B7'} FRESHLY PUBLISHED</Typography>
              </Box>
              <Typography sx={useStyles(styles, 'see-all')}>See all {'\u2192'}</Typography>
            </Box>
            <Box sx={useStyles(styles, 'mods-grid--six')}>
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
