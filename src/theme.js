import { createTheme } from '@mui/material/styles'

// Curvas de movimento do Material 3
export const easing = {
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
}

// Gradiente-assinatura do site: ciano → azul → violeta → rosa.
// Mesma família de cores das interfaces de IA do Google, com uma ponta ciano própria.
export const aiGradient =
  'linear-gradient(90deg, #22c3ee 0%, #4f7cff 30%, #9b6bff 62%, #ff6b9a 100%)'

const fontSans = '"Google Sans Flex", "Google Sans", Roboto, system-ui, sans-serif'
export const fontMono = '"Google Sans Code", ui-monospace, SFMono-Regular, Menlo, monospace'

const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data' },
  colorSchemes: {
    light: {
      palette: {
        primary: { main: '#0b57d0', contrastText: '#ffffff' },
        secondary: { main: '#8e4ec6' },
        background: { default: '#f8fafd', paper: '#ffffff' },
        text: { primary: '#1f1f1f', secondary: '#444746' },
        divider: 'rgba(31, 31, 31, 0.12)',
        surface: {
          container: '#f0f4f9',
          containerHigh: '#e9eef6',
          outline: '#c4c7c5',
          glow: 'rgba(79, 124, 255, 0.18)',
        },
      },
    },
    dark: {
      palette: {
        primary: { main: '#a8c7fa', contrastText: '#062e6f' },
        secondary: { main: '#d7b8ff' },
        background: { default: '#0e0f12', paper: '#1b1c1f' },
        text: { primary: '#e3e3e3', secondary: '#c4c7c5' },
        divider: 'rgba(227, 227, 227, 0.12)',
        surface: {
          container: '#1e1f22',
          containerHigh: '#28292d',
          outline: '#444746',
          glow: 'rgba(124, 140, 255, 0.28)',
        },
      },
    },
  },
  shape: { borderRadius: 16 },
  typography: {
    fontFamily: fontSans,
    h1: { fontWeight: 500, letterSpacing: '-0.03em', lineHeight: 1.05 },
    h2: { fontWeight: 500, letterSpacing: '-0.02em' },
    h3: { fontWeight: 500, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 500, letterSpacing: 0 },
    overline: { fontFamily: fontMono, letterSpacing: '0.12em' },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 999,
          paddingInline: 22,
          minHeight: 44,
          transition: `transform 200ms ${easing.emphasized}, box-shadow 200ms ${easing.emphasized}, background-color 200ms`,
          '&:active': { transform: 'scale(0.97)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { borderRadius: 8, fontWeight: 500 },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { borderRadius: 28, backgroundImage: 'none' },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: { borderRadius: 8, fontSize: 13, padding: '6px 10px' },
      },
    },
  },
})

export default theme
