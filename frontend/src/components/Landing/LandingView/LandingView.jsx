import { Box, Typography } from '@mui/material'
import { MOD_FEATURES, FORGE_FEATURES } from '~/constants'
import { styles } from './LandingView.styles'
import { useStyles } from '~/hooks/useStyles'

export const LandingView = ({ onSelect }) => {
  return (
    <Box sx={useStyles(styles, 'landing-body')}>
      {/* Mod card */}
      <Box
        sx={{ ...useStyles(styles, 'mode-card'), ...useStyles(styles, 'mode-card--mod') }}
        onClick={() => onSelect('mod')}
      >
        <Box sx={{ ...useStyles(styles, 'mode-card-icon'), ...useStyles(styles, 'mode-card-icon--mod') }}>
          {'\u{1F3AE}'}
        </Box>
        <Typography sx={useStyles(styles, 'mode-card-title')}>
          MOD YOUR<br />
          <Box component='span' sx={useStyles(styles, 'mode-card-title--mod-accent')}>GAME</Box>
        </Typography>
        <Typography sx={useStyles(styles, 'mode-card-sub')}>
          Browse thousands of mods across your favourite games. Find what's trending, discover hidden gems, and install in one click.
        </Typography>
        <Box sx={useStyles(styles, 'mode-card-features')}>
          {MOD_FEATURES.map((feature) => (
            <Box key={feature} sx={useStyles(styles, 'mode-feat')}>
              <Box sx={{ ...useStyles(styles, 'feat-dot'), ...useStyles(styles, 'feat-dot--mod') }} />
              {feature}
            </Box>
          ))}
        </Box>
        <Box component='button' sx={{ ...useStyles(styles, 'mode-card-cta'), ...useStyles(styles, 'mode-card-cta--mod') }}>
          Find Mods <Box component='span' sx={useStyles(styles, 'cta-arrow')}>{'\u2192'}</Box>
        </Box>
      </Box>

      {/* Divider */}
      <Box sx={useStyles(styles, 'mode-divider')}>
        <Box sx={useStyles(styles, 'mode-divider-line')} />
        or
        <Box sx={useStyles(styles, 'mode-divider-line')} />
      </Box>

      {/* Forge card */}
      <Box
        sx={{ ...useStyles(styles, 'mode-card'), ...useStyles(styles, 'mode-card--forge') }}
        onClick={() => onSelect('forge')}
      >
        <Box sx={{ ...useStyles(styles, 'mode-card-icon'), ...useStyles(styles, 'mode-card-icon--forge') }}>
          {'\u{2699}\u{FE0F}'}
        </Box>
        <Typography sx={useStyles(styles, 'mode-card-title')}>
          FORGE YOUR<br />
          <Box component='span' sx={useStyles(styles, 'mode-card-title--forge-accent')}>PROJECT</Box>
        </Typography>
        <Typography sx={useStyles(styles, 'mode-card-sub')}>
          Everything a mod creator needs — project management, bug tracking, kanban boards, release pipelines, and community metrics in one place.
        </Typography>
        <Box sx={useStyles(styles, 'mode-card-features')}>
          {FORGE_FEATURES.map((feature) => (
            <Box key={feature} sx={useStyles(styles, 'mode-feat')}>
              <Box sx={{ ...useStyles(styles, 'feat-dot'), ...useStyles(styles, 'feat-dot--forge') }} />
              {feature}
            </Box>
          ))}
        </Box>
        <Box component='button' sx={{ ...useStyles(styles, 'mode-card-cta'), ...useStyles(styles, 'mode-card-cta--forge') }}>
          Forge Ahead <Box component='span' sx={useStyles(styles, 'cta-arrow')}>{'\u2192'}</Box>
        </Box>
      </Box>
    </Box>
  )
}
