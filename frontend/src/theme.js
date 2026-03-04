import { createTheme } from '@mui/material/styles'

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#5865F2', // Discord blue
    },
    secondary: {
      main: '#944527', // ModForge brown
    },
    background: {
      default: '#1a1a1a',
      paper: '#242424',
    },
    error: { main: '#e53935' },
    warning: { main: '#e0b83a' },
    success: { main: '#43a047' },
  },
  typography: {
    fontFamily: 'Raleway, Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#1a1a1a',
          color: '#e0e0e0',
          scrollbarColor: '#444 #1a1a1a',
          '&::-webkit-scrollbar': { width: 8 },
          '&::-webkit-scrollbar-track': { background: '#1a1a1a' },
          '&::-webkit-scrollbar-thumb': { background: '#444', borderRadius: 4 },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
})

export default theme
