import { useState } from 'react'
import {
  Avatar,
  Box,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from '@mui/material'
import AccountCircle from '@mui/icons-material/AccountCircle'
import Logout from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/hooks/useAuth'
import { DISCORD_AUTH_URL } from '~/constants'
import { styles } from './Header.styles'
import { getStyle, cx } from '~/hooks/useStyles'

export const Header = ({ mode }) => {
  const { user, logout, isAuthenticated } = useAuth() || {}
  const { avatar_url: avatarUrl, username } = user || {}
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleToggleMode = () => {
    const next = mode === 'mod' ? 'forge' : 'mod'
    localStorage.setItem('modforge_view_mode', next)
    navigate(`/${next}`)
  }

  const handleAvatarClick = (event) => {
    const { currentTarget } = event || {}
    setAnchorEl(anchorEl ? null : currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
  }

  return (
    <Box sx={getStyle(styles, 'header')}>
      <Box sx={getStyle(styles, 'header__logo')} onClick={() => navigate(mode ? `/${mode}` : '/')}>
        {(() => {
          const modSize = mode === 'mod' ? 'header__logo-lg' : mode === 'forge' ? 'header__logo-sm' : 'header__logo-lg'
          const modColor = mode === 'mod' ? 'header__logo--blue' : 'header__logo--white'
          const forgeSize = mode === 'forge' ? 'header__logo-lg' : mode === 'mod' ? 'header__logo-sm' : 'header__logo-lg'
          const forgeColor = mode === 'forge' ? 'header__logo--orange' : 'header__logo--white'
          return (
            <>
              <Typography component='span' sx={cx(styles, modSize, modColor)}>M</Typography>
              <Typography component='span' sx={cx(styles, modSize, modColor)}>OD</Typography>
              <Typography component='span' sx={cx(styles, forgeSize, forgeColor)}>F</Typography>
              <Typography component='span' sx={cx(styles, forgeSize, forgeColor)}>ORGE</Typography>
            </>
          )
        })()}
      </Box>

      <Box sx={getStyle(styles, 'header__nav')}>
        <Box sx={getStyle(styles, 'header__nav-item')} onClick={() => navigate('/blogs')}>Blog</Box>
        <Box sx={getStyle(styles, 'header__nav-item')} onClick={() => navigate('/credits')}>Credits</Box>
      </Box>

      {mode && (
        <Box
          sx={cx(styles, 'header__mode-indicator', mode === 'mod' ? 'header__mode-indicator--mod' : 'header__mode-indicator--forge')}
          onClick={handleToggleMode}
        >
          {mode === 'mod' ? '\u{1F3AE}' : '\u{2699}\u{FE0F}'}
          <Box component='span'>{mode === 'mod' ? 'Mod View' : 'Forge View'}</Box>
          <Box component='span' sx={getStyle(styles, 'header__mode-switch')}>{'\u2194'} switch</Box>
        </Box>
      )}

      <Box sx={getStyle(styles, 'header__right')}>
        {mode && (
          <Box sx={getStyle(styles, 'header__search-pill')}>
            <Box component='span' sx={getStyle(styles, 'header__search-icon')}>{'\u2315'}</Box>
            Search...
            <Box component='span' sx={getStyle(styles, 'header__search-key')}>{'\u2318'}K</Box>
          </Box>
        )}
        <Box
          component='button'
          sx={getStyle(styles, 'header__donate-btn')}
          onClick={() => window.open('https://www.paypal.com/donate/?hosted_button_id=YWNUFXPDDYNSL', '_blank')}
        >
          Donate
        </Box>
        {isAuthenticated ? (
          <Box sx={getStyle(styles, 'header__avatar-wrap')}>
            <Avatar
              alt={username}
              src={avatarUrl}
              sx={getStyle(styles, 'header__avatar')}
              onClick={handleAvatarClick}
            >
              {(username || '?')[0]}
            </Avatar>
            <Menu
              anchorEl={anchorEl}
              anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              id='account-menu'
              onClose={handleMenuClose}
              open={isMenuOpen}
              slotProps={{ paper: { elevation: 0, sx: getStyle(styles, 'header__menu-paper') } }}
              transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            >
              <MenuItem onClick={() => { handleMenuClose(); navigate('/profile') }}>
                <ListItemIcon>
                  <AccountCircle fontSize='small' />
                </ListItemIcon>
                My Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <Logout fontSize='small' />
                </ListItemIcon>
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box
            component='a'
            href={DISCORD_AUTH_URL}
            sx={getStyle(styles, 'header__login-btn')}
          >
            Discord Login
          </Box>
        )}
      </Box>
    </Box>
  )
}
