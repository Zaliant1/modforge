import { useState } from 'react'
import {
  AppBar,
  Avatar,
  Box,
  ListItemButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from '@mui/material'
import Logout from '@mui/icons-material/Logout'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '~/hooks/useAuth'
import { DISCORD_AUTH_URL } from '~/constants'
import { styles } from './Header.styles'
import { useStyles } from '~/hooks/useStyles'

export const Header = () => {
  const { user, logout, isAuthenticated } = useAuth() || {}
  const { avatar_url, username } = user || {}
  const navigate = useNavigate()
  const [anchorEl, setAnchorEl] = useState(null)
  const isMenuOpen = Boolean(anchorEl)

  const handleAvatarClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = () => {
    handleMenuClose()
    logout()
  }

  return (
    <AppBar position='fixed' sx={useStyles(styles, 'header')} elevation={0}>
      <Toolbar disableGutters>
        <ListItemButton
          onClick={() => navigate('/')}
          sx={useStyles(styles, 'header__nav-item')}
        >
          <Typography sx={useStyles(styles, 'header__brand-text')}>
            ModForge
          </Typography>
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate('/blogs')}
          sx={useStyles(styles, 'header__nav-item')}
        >
          <Typography sx={useStyles(styles, 'header__nav-text')}>
            Blog
          </Typography>
        </ListItemButton>

        <ListItemButton
          onClick={() => navigate('/credits')}
          sx={useStyles(styles, 'header__nav-item')}
        >
          <Typography sx={useStyles(styles, 'header__nav-text')}>
            Credits
          </Typography>
        </ListItemButton>

        <Box sx={useStyles(styles, 'header__spacer')} />

        {isAuthenticated ? (
          <Box sx={useStyles(styles, 'header__actions')}>
            <ListItemButton
              onClick={() =>
                window.open(
                  'https://www.paypal.com/donate/?hosted_button_id=YWNUFXPDDYNSL',
                  '_blank',
                )
              }
              sx={useStyles(styles, 'header__donate')}
            >
              <Typography sx={useStyles(styles, 'header__donate-text')}>
                Donate
              </Typography>
            </ListItemButton>

            <Box sx={useStyles(styles, 'header__avatar-container')}>
              <Avatar
                alt={username}
                src={avatar_url}
                sx={useStyles(styles, 'header__avatar')}
                onClick={handleAvatarClick}
              />
              <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                id='account-menu'
                onClose={handleMenuClose}
                open={isMenuOpen}
                slotProps={{ paper: { elevation: 0, sx: useStyles(styles, 'header__menu-paper') } }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
              >
                <MenuItem onClick={handleLogout}>
                  <ListItemIcon>
                    <Logout fontSize='small' />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        ) : (
          <Box sx={useStyles(styles, 'header__login')}>
            <ListItemButton
              href={DISCORD_AUTH_URL}
              sx={useStyles(styles, 'header__login-btn')}
            >
              <Typography sx={useStyles(styles, 'header__login-text')}>
                Discord Login
              </Typography>
            </ListItemButton>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  )
}
