import { createTheme } from '@mui/material/styles';
import { duration, easing, stateLayer, transition } from './motion';
import { amber, ink, lime, red, violet } from './tokens';

/** Google Sans Flex: the typeface of Google's Material 3 Expressive and Gemini-era materials. */
export const fontFamily =
  '"Google Sans Flex Variable", "Google Sans Flex", "Google Sans", "Roboto Flex", Roboto, system-ui, -apple-system, "Segoe UI", sans-serif';
export const monoFontFamily =
  '"Google Sans Code", "Roboto Mono", ui-monospace, SFMono-Regular, Menlo, monospace';

/** Rounded terminals (ROND axis) for display text and buttons, as in M3 Expressive. */
const ROUNDED = "'ROND' 100";

const radius = { sm: 8, md: 10, lg: 16, xl: 24, full: 999 };

const focusRing = (theme) => ({
  outline: `2px solid ${theme.vars.palette.primary.main}`,
  outlineOffset: 2,
});

export const theme = createTheme({
  cssVariables: { colorSchemeSelector: 'data', cssVarPrefix: 'faisca' },
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: violet[600],
          light: violet[500],
          dark: violet[700],
          contrastText: '#FFFFFF',
          container: violet[100],
          onContainer: violet[800],
        },
        secondary: {
          main: lime[400],
          light: lime[300],
          dark: lime[500],
          contrastText: violet[900],
          container: lime[100],
          onContainer: lime[800],
        },
        lime: {
          main: lime[400],
          light: lime[300],
          dark: lime[500],
          contrastText: violet[900],
          container: lime[100],
          onContainer: lime[800],
        },
        neutral: {
          main: ink[500],
          light: ink[400],
          dark: ink[600],
          contrastText: '#FFFFFF',
          container: ink[50],
          onContainer: ink[600],
        },
        success: {
          main: lime[700],
          light: lime[600],
          dark: lime[800],
          contrastText: '#FFFFFF',
          container: lime[100],
          onContainer: lime[800],
        },
        info: {
          main: violet[500],
          light: violet[400],
          dark: violet[700],
          contrastText: '#FFFFFF',
          container: violet[100],
          onContainer: violet[700],
        },
        error: {
          main: red.light,
          light: '#E0505D',
          dark: '#A11F2C',
          contrastText: '#FFFFFF',
          container: '#FDECEE',
          onContainer: '#8C1623',
        },
        warning: {
          main: amber.light,
          light: '#C77A12',
          dark: '#7A4500',
          contrastText: '#FFFFFF',
          container: '#FFF3DF',
          onContainer: '#6B3D00',
        },
        background: { default: ink[25], paper: ink[0], subtle: ink[50] },
        text: { primary: ink[950], secondary: ink[500], disabled: ink[400] },
        divider: ink[100],
        action: { active: ink[500], hover: 'rgba(91, 45, 176, 0.06)' },
        Avatar: { defaultBg: violet[200] },
      },
    },
    dark: {
      palette: {
        primary: {
          main: lime[400],
          light: lime[300],
          dark: lime[500],
          contrastText: violet[900],
          container: 'rgba(198, 239, 52, 0.14)',
          onContainer: lime[300],
        },
        secondary: {
          main: violet[300],
          light: violet[200],
          dark: violet[400],
          contrastText: ink[950],
          container: 'rgba(187, 164, 238, 0.16)',
          onContainer: violet[200],
        },
        lime: {
          main: lime[400],
          light: lime[300],
          dark: lime[500],
          contrastText: violet[900],
          container: 'rgba(198, 239, 52, 0.14)',
          onContainer: lime[300],
        },
        neutral: {
          main: ink[300],
          light: ink[200],
          dark: ink[400],
          contrastText: ink[950],
          container: 'rgba(255, 255, 255, 0.07)',
          onContainer: ink[200],
        },
        success: {
          main: lime[400],
          light: lime[300],
          dark: lime[500],
          contrastText: violet[900],
          container: 'rgba(198, 239, 52, 0.12)',
          onContainer: lime[300],
        },
        info: {
          main: violet[300],
          light: violet[200],
          dark: violet[400],
          contrastText: ink[950],
          container: 'rgba(187, 164, 238, 0.16)',
          onContainer: violet[200],
        },
        error: {
          main: red.dark,
          light: '#FFB0B3',
          dark: '#E5626A',
          contrastText: ink[950],
          container: 'rgba(255, 138, 143, 0.14)',
          onContainer: '#FFC9CB',
        },
        warning: {
          main: amber.dark,
          light: '#FFD699',
          dark: '#E0A344',
          contrastText: ink[950],
          container: 'rgba(255, 196, 107, 0.14)',
          onContainer: '#FFE1B3',
        },
        background: { default: ink[950], paper: ink[900], subtle: ink[850] },
        text: { primary: '#F4F1FB', secondary: ink[300], disabled: ink[500] },
        divider: ink[700],
        action: { active: ink[300], hover: 'rgba(198, 239, 52, 0.06)' },
        Avatar: { defaultBg: violet[700] },
      },
    },
  },
  shape: { borderRadius: radius.md },
  typography: {
    fontFamily,
    htmlFontSize: 16,
    h1: {
      fontSize: '2.75rem',
      fontWeight: 600,
      lineHeight: 1.1,
      letterSpacing: '-0.025em',
      fontVariationSettings: ROUNDED,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.15,
      letterSpacing: '-0.02em',
      fontVariationSettings: ROUNDED,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: '-0.015em',
      fontVariationSettings: ROUNDED,
    },
    h4: {
      fontSize: '1.625rem',
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: '-0.01em',
      fontVariationSettings: ROUNDED,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.005em',
      fontVariationSettings: ROUNDED,
    },
    h6: { fontSize: '1.0625rem', fontWeight: 600, lineHeight: 1.4, fontVariationSettings: ROUNDED },
    subtitle1: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.45 },
    body1: { fontSize: '1rem', lineHeight: 1.55 },
    body2: { fontSize: '0.875rem', lineHeight: 1.5 },
    button: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.005em',
      fontVariationSettings: ROUNDED,
    },
    caption: { fontSize: '0.75rem', lineHeight: 1.4, letterSpacing: '0.01em' },
    overline: { fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.08em', lineHeight: 1.6 },
  },
  transitions: {
    easing: {
      easeInOut: easing.standard,
      easeOut: easing.emphasizedDecelerate,
      easeIn: easing.emphasizedAccelerate,
      sharp: easing.standardAccelerate,
    },
    duration: {
      shortest: duration.short3,
      shorter: duration.short4,
      short: duration.medium1,
      standard: duration.medium2,
      complex: duration.medium4,
      enteringScreen: duration.medium4,
      leavingScreen: duration.short4,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: (theme) => ({
        html: { WebkitFontSmoothing: 'antialiased', MozOsxFontSmoothing: 'grayscale' },
        body: {
          backgroundColor: theme.vars.palette.background.default,
          fontOpticalSizing: 'auto',
        },
        'code, kbd, pre, samp': { fontFamily: monoFontFamily },
        '::selection': { backgroundColor: lime[300], color: violet[900] },
        // Extensões do site: gradientes e brilho da marca Faísca, trocados junto com o modo de cor.
        ':root': {
          '--site-gradiente': `linear-gradient(90deg, ${violet[500]}, ${lime[400]})`,
          '--site-gradiente-texto': `linear-gradient(90deg, ${violet[600]}, ${violet[500]})`,
          '--site-brilho': 'rgba(91, 45, 176, 0.28)',
        },
        'html[data-dark]': {
          '--site-gradiente': `linear-gradient(90deg, ${lime[400]}, ${violet[400]})`,
          '--site-gradiente-texto': `linear-gradient(90deg, ${lime[300]}, ${violet[300]})`,
          '--site-brilho': 'rgba(198, 239, 52, 0.22)',
        },
        '@media (prefers-reduced-motion: reduce)': {
          '*, *::before, *::after': {
            animationDuration: '0.01ms !important',
            animationIterationCount: '1 !important',
            transitionDuration: '0.01ms !important',
            scrollBehavior: 'auto !important',
          },
        },
      }),
    },
    MuiButtonBase: {
      defaultProps: { disableTouchRipple: false },
      styleOverrides: {
        root: ({ theme }) => ({
          '&.Mui-focusVisible': focusRing(theme),
        }),
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const color =
            ownerState.color && ownerState.color !== 'inherit'
              ? theme.vars.palette[ownerState.color]
              : theme.vars.palette.primary;
          return {
            borderRadius: radius.md,
            minHeight: 40,
            paddingInline: 18,
            transition: [
              transition(['background-color', 'border-color', 'color', 'box-shadow'], 'short4'),
              transition('transform', 'medium1', 'springFast'),
            ].join(', '),
            '&:active': { transform: 'scale(0.97)' },
            ...(ownerState.variant === 'contained' && {
              '&:hover': {
                boxShadow: `0 6px 20px -6px ${theme.alpha(color.main, 0.55)}`,
              },
            }),
            ...(ownerState.variant === 'outlined' && {
              borderWidth: 1.5,
              '&:hover': {
                borderWidth: 1.5,
                backgroundColor: theme.alpha(color.main, stateLayer.hover),
              },
            }),
            ...(ownerState.variant === 'tonal' && {
              backgroundColor: color.container,
              color: color.onContainer,
              '&:hover': {
                backgroundColor: `color-mix(in srgb, ${color.container}, ${color.main} 14%)`,
              },
            }),
          };
        },
        sizeLarge: { minHeight: 48, paddingInline: 24, fontSize: '1rem' },
        sizeSmall: { minHeight: 32, paddingInline: 12, fontSize: '0.8125rem' },
        startIcon: { marginRight: 6 },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: [
            transition(['background-color', 'color'], 'short4'),
            transition('transform', 'medium1', 'springFast'),
          ].join(', '),
          '&:active': { transform: 'scale(0.9)' },
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: { borderRadius: radius.lg, boxShadow: 'none', textTransform: 'none' },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: { backgroundImage: 'none' },
        rounded: { borderRadius: radius.lg },
        outlined: ({ theme }) => ({ borderColor: theme.vars.palette.divider }),
      },
    },
    MuiCard: {
      defaultProps: { variant: 'outlined' },
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: radius.lg,
          borderColor: theme.vars.palette.divider,
          transition: transition(['border-color', 'box-shadow', 'transform'], 'medium1'),
        }),
      },
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: 20, '&:last-child': { paddingBottom: 20 } } },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: radius.md,
          backgroundColor: theme.vars.palette.background.paper,
          transition: transition(['box-shadow', 'background-color'], 'short4'),
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.vars.palette.divider,
            transition: transition('border-color', 'short4'),
          },
          '&:hover:not(.Mui-disabled):not(.Mui-focused):not(.Mui-error) .MuiOutlinedInput-notchedOutline':
            { borderColor: theme.vars.palette.text.disabled },
          '&.Mui-focused': {
            boxShadow: `0 0 0 4px ${theme.alpha(theme.vars.palette.primary.main, 0.14)}`,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: 1.5 },
          '&.Mui-error.Mui-focused': {
            boxShadow: `0 0 0 4px ${theme.alpha(theme.vars.palette.error.main, 0.14)}`,
          },
          ...theme.applyStyles('dark', {
            backgroundColor: theme.vars.palette.background.subtle,
          }),
        }),
        input: ({ theme }) => ({
          padding: '13px 16px',
          '.MuiInputBase-sizeSmall &': { padding: '9px 12px' },
          '&::placeholder': { color: theme.vars.palette.text.disabled, opacity: 1 },
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: { root: { fontWeight: 500 } },
    },
    MuiFormLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.vars.palette.text.secondary,
          fontSize: '0.9375rem',
          fontWeight: 500,
          '&.Mui-focused': { color: theme.vars.palette.text.secondary },
        }),
      },
    },
    MuiFormHelperText: {
      styleOverrides: { root: { marginInline: 2, marginTop: 6, fontSize: '0.8125rem' } },
    },
    MuiLink: {
      defaultProps: { underline: 'hover' },
      styleOverrides: {
        root: ({ theme }) => ({
          fontWeight: 600,
          borderRadius: 4,
          transition: transition('color', 'short3'),
          '&.Mui-focusVisible, &:focus-visible': focusRing(theme),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const key =
            ownerState.color && ownerState.color !== 'default' ? ownerState.color : 'neutral';
          const color = theme.vars.palette[key];
          return {
            borderRadius: radius.full,
            fontWeight: 500,
            height: 26,
            fontSize: '0.8125rem',
            transition: transition(['background-color', 'box-shadow'], 'short4'),
            ...(ownerState.variant === 'soft' && {
              backgroundColor: color.container,
              color: color.onContainer,
              border: 'none',
              '&.MuiChip-clickable:hover': {
                backgroundColor: `color-mix(in srgb, ${color.container}, ${color.main} 16%)`,
              },
              '& .MuiChip-icon': { color: 'inherit' },
            }),
          };
        },
        label: { paddingInline: 10 },
        sizeSmall: { height: 22, fontSize: '0.75rem' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const key =
            ownerState.color && ownerState.color !== 'inherit' ? ownerState.color : 'primary';
          return {
            height: 6,
            borderRadius: radius.full,
            backgroundColor: theme.alpha(theme.vars.palette[key].main, 0.16),
          };
        },
        bar: {
          borderRadius: radius.full,
          transition: `transform ${duration.long2}ms ${easing.emphasizedDecelerate}`,
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 44 },
        indicator: { height: 3, borderRadius: '3px 3px 0 0' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: ({ theme }) => ({
          minHeight: 44,
          textTransform: 'none',
          fontWeight: 500,
          fontSize: '0.9375rem',
          paddingInline: 12,
          minWidth: 0,
          color: theme.vars.palette.text.secondary,
          transition: transition(['color', 'background-color'], 'short4'),
          '&:hover': { color: theme.vars.palette.text.primary },
          '&.Mui-selected': { fontWeight: 600 },
        }),
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.vars.palette.background.subtle,
          padding: 3,
          borderRadius: radius.md,
          gap: 2,
        }),
        grouped: {
          border: 0,
          borderRadius: `${radius.sm}px !important`,
          margin: 0,
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          textTransform: 'none',
          fontWeight: 500,
          paddingBlock: 5,
          paddingInline: 14,
          color: theme.vars.palette.text.secondary,
          transition: transition(['background-color', 'color', 'box-shadow'], 'short4'),
          '&.Mui-selected, &.Mui-selected:hover': {
            backgroundColor: theme.vars.palette.background.paper,
            color: theme.vars.palette.primary.main,
            boxShadow: `0 1px 3px ${theme.alpha('#1C1433', 0.12)}`,
          },
          ...theme.applyStyles('dark', {
            '&.Mui-selected, &.Mui-selected:hover': {
              backgroundColor: theme.vars.palette.primary.container,
              boxShadow: 'none',
            },
          }),
        }),
      },
    },
    // Material 3 switch: 52×32 track, thumb grows when checked.
    MuiSwitch: {
      defaultProps: { disableRipple: true },
      styleOverrides: {
        root: { width: 52, height: 32, padding: 0, margin: 8, overflow: 'visible' },
        switchBase: ({ theme }) => ({
          padding: 0,
          top: 0,
          left: 0,
          width: 32,
          height: 32,
          transition: `transform ${duration.medium1}ms ${easing.springFast}`,
          '&.Mui-checked': {
            transform: 'translateX(20px)',
            color: theme.vars.palette.primary.contrastText,
            '& + .MuiSwitch-track': {
              opacity: 1,
              backgroundColor: theme.vars.palette.primary.main,
              borderColor: theme.vars.palette.primary.main,
            },
            '& .MuiSwitch-thumb': { width: 24, height: 24, margin: 4 },
          },
          '&:hover .MuiSwitch-thumb, &.Mui-focusVisible .MuiSwitch-thumb': {
            boxShadow: `0 0 0 8px ${theme.alpha(theme.vars.palette.primary.main, stateLayer.hover)}`,
          },
          '&.Mui-focusVisible + .MuiSwitch-track': focusRing(theme),
          '&.Mui-disabled + .MuiSwitch-track': { opacity: 0.38 },
          '&:active .MuiSwitch-thumb': { width: 28, height: 28, margin: 2 },
        }),
        thumb: ({ theme }) => ({
          width: 16,
          height: 16,
          margin: 8,
          boxShadow: 'none',
          backgroundColor: theme.vars.palette.text.secondary,
          transition: transition(
            ['width', 'height', 'margin', 'background-color', 'box-shadow'],
            'short4',
          ),
          '.Mui-checked &': { backgroundColor: theme.vars.palette.primary.contrastText },
        }),
        track: ({ theme }) => ({
          borderRadius: radius.full,
          opacity: 1,
          backgroundColor: theme.vars.palette.background.subtle,
          border: `2px solid ${theme.vars.palette.text.secondary}`,
          boxSizing: 'border-box',
          transition: transition(['background-color', 'border-color'], 'short4'),
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: radius.sm,
          color: theme.vars.palette.text.disabled,
          '& .MuiSvgIcon-root': { transition: transition('transform', 'medium1', 'springFast') },
          '&.Mui-checked .MuiSvgIcon-root': { transform: 'scale(1.05)' },
        }),
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: ({ theme }) => ({ color: theme.vars.palette.text.disabled }),
      },
    },
    MuiFormControlLabel: {
      styleOverrides: { label: { fontSize: '0.9375rem' } },
    },
    MuiAlert: {
      defaultProps: { variant: 'standard' },
      styleOverrides: {
        root: ({ theme, ownerState }) => {
          const color = theme.vars.palette[ownerState.severity ?? 'info'];
          return {
            borderRadius: 12,
            alignItems: 'flex-start',
            ...(ownerState.variant === 'standard' && {
              backgroundColor: color.container,
              color: theme.vars.palette.text.primary,
              border: `1px solid ${theme.alpha(color.main, 0.45)}`,
              '& .MuiAlert-icon': { color: color.main },
            }),
          };
        },
        message: { paddingBlock: 8 },
        icon: { paddingBlock: 9 },
      },
    },
    MuiAlertTitle: {
      styleOverrides: { root: { fontWeight: 600, marginBottom: 2, marginTop: 0 } },
    },
    MuiAvatar: {
      styleOverrides: {
        root: { fontWeight: 600, fontSize: '0.875rem' },
      },
    },
    MuiAvatarGroup: {
      styleOverrides: {
        avatar: ({ theme }) => ({
          width: 28,
          height: 28,
          fontSize: '0.6875rem',
          borderWidth: 2,
          borderColor: theme.vars.palette.background.paper,
        }),
      },
    },
    MuiBadge: {
      styleOverrides: { badge: { fontWeight: 600 } },
    },
    MuiTooltip: {
      defaultProps: { arrow: true, enterDelay: 300 },
      styleOverrides: {
        tooltip: {
          backgroundColor: ink[900],
          color: '#F4F1FB',
          fontSize: '0.8125rem',
          fontWeight: 500,
          borderRadius: radius.sm,
          padding: '6px 10px',
        },
        arrow: { color: ink[900] },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: ({ theme }) => ({
          borderRadius: 14,
          border: `1px solid ${theme.vars.palette.divider}`,
          boxShadow: `0 16px 40px -12px ${theme.alpha('#140E26', 0.28)}`,
          marginTop: 6,
        }),
        list: { padding: 6 },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: { borderRadius: radius.sm, minHeight: 40, gap: 12, fontSize: '0.9375rem' },
      },
    },
    MuiListItemIcon: {
      styleOverrides: { root: { minWidth: 0 } },
    },
    MuiDialog: {
      styleOverrides: {
        paper: { borderRadius: 28, padding: 8 },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 600, fontVariationSettings: ROUNDED } },
    },
    MuiSnackbarContent: {
      styleOverrides: {
        root: { borderRadius: 12, backgroundColor: ink[900], color: '#F4F1FB', fontWeight: 500 },
      },
    },
    MuiAppBar: {
      defaultProps: { elevation: 0, color: 'inherit' },
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.alpha(theme.vars.palette.background.paper, 0.82),
          backdropFilter: 'saturate(180%) blur(14px)',
          borderBottom: `1px solid ${theme.vars.palette.divider}`,
        }),
      },
    },
    MuiDivider: {
      styleOverrides: { root: ({ theme }) => ({ borderColor: theme.vars.palette.divider }) },
    },
    MuiSkeleton: {
      defaultProps: { animation: 'wave' },
      styleOverrides: { rounded: { borderRadius: radius.md } },
    },
    MuiBottomNavigation: {
      styleOverrides: {
        root: ({ theme }) => ({
          height: 72,
          backgroundColor: theme.vars.palette.background.paper,
          borderTop: `1px solid ${theme.vars.palette.divider}`,
        }),
      },
    },
    MuiBottomNavigationAction: {
      styleOverrides: {
        root: ({ theme }) => ({
          gap: 4,
          color: theme.vars.palette.text.secondary,
          '& .MuiSvgIcon-root': {
            width: 56,
            height: 30,
            padding: '4px 16px',
            borderRadius: radius.full,
            transition: transition(['background-color', 'transform'], 'medium1', 'springFast'),
          },
          '&.Mui-selected': { color: theme.vars.palette.text.primary },
          '&.Mui-selected .MuiSvgIcon-root': {
            backgroundColor: theme.vars.palette.primary.container,
            color: theme.vars.palette.primary.onContainer,
          },
        }),
        label: { fontSize: '0.75rem', fontWeight: 600, '&.Mui-selected': { fontSize: '0.75rem' } },
      },
    },
  },
});
