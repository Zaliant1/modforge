import { createTheme } from '@mui/material/styles'
import thunderstrikeFont from '~/assets/fonts/thunderstrike.ttf'

const palette = {
  mode: 'dark',
  primary: {
    main: '#f97316',
    light: '#fb923c',
    dark: '#c2410c',
  },
  secondary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#1d4ed8',
  },
  background: {
    default: '#0c0c0e',
    paper: '#131316',
    card: '#17171b',
    cardHover: '#1c1c21',
  },
  discord: {
    main: '#5865f2',
    dark: '#4752c4',
  },
  status: {
    reported: '#7a2a1e',
    reportedLight: '#c4442f',
    inProgress: '#7a6022',
    inProgressLight: '#c49a36',
    completed: '#2a612e',
    completedLight: '#44a34a',
    wontFix: '#3a3e40',
    wontFixLight: '#6a7075',
  },
  priority: {
    low: '#3b82f6',
    medium: '#eab308',
    high: '#ef4444',
  },
  donate: {
    main: 'rgba(255, 215, 0, 0.2)',
  },
  border: {
    subtle: 'rgba(255,255,255,0.07)',
    light: 'rgba(255,255,255,0.12)',
  },
  overlay: {
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  shadow: {
    card: '0 4px 12px rgba(0,0,0,0.5)',
  },
  surface: {
    scrollbar: '#2a2a30',
    lighter: '#1d1d23',
    lighterHover: '#232329',
    light: '#17171b',
    lightHover: '#1d1d23',
    dark: '#131316',
    darkHover: '#17171b',
    fill: '#0a0a0b',
  },
  error: { main: '#ef4444' },
  warning: { main: '#eab308' },
  success: { main: '#22c55e' },
  text: {
    primary: '#f0eff5',
    secondary: '#8a8aa0',
  },
  forge: {
    bg: '#0c0c0e',
    nav: '#0f0f11',
    surface: '#131316',
    card: '#17171b',
    cardHi: '#1c1c21',
    border: 'rgba(255,255,255,0.07)',
    borderHi: 'rgba(255,255,255,0.12)',
    text: '#f0eff5',
    text2: '#8a8aa0',
    text3: '#42424f',
    accent: '#f97316',
    accLo: 'rgba(249,115,22,0.10)',
    accMed: 'rgba(249,115,22,0.18)',
    accGlow: 'rgba(249,115,22,0.22)',
    green: '#22c55e',
    red: '#ef4444',
    yellow: '#eab308',
    blue: '#3b82f6',
    purple: '#a855f7',
    donateBg: '#5c4a1e',
    donateBgHover: '#6b5520',
    donateText: '#f5c842',
    modBlue: '#60a5fa',
    modBg: '#1e3a5f',
    modBgHover: '#1e4a7a',
    modBorder: 'rgba(59,130,246,0.2)',
    modGlow: 'rgba(59,130,246,0.3)',
    modRadial: 'rgba(59,130,246,0.08)',
    modGlowShadow: 'rgba(59,130,246,0.1)',
    accentHover: '#fb923c',
  },
}

const theme = createTheme({
  palette,
  typography: {
    fontFamily: '"Outfit", "Raleway", Arial, sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': {
          fontFamily: 'ThunderStrike',
          src: `url(${thunderstrikeFont}) format('truetype')`,
          fontWeight: 'normal',
          fontStyle: 'normal',
          fontDisplay: 'swap',
        },
        body: {
          backgroundColor: palette.background.default,
          color: palette.text.primary,
          scrollbarColor: `${palette.surface.scrollbar} ${palette.background.default}`,
          '&::-webkit-scrollbar': { width: 3 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.08)', borderRadius: 2 },
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

export const vars = {
  ...palette.forge,
  ts: '"ThunderStrike", "Anton", sans-serif',
  heading: '"Outfit", sans-serif',
  ui: '"Outfit", sans-serif',
  mono: '"JetBrains Mono", monospace',
}

export default theme
