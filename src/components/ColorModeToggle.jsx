import { IconButton, Tooltip } from '@mui/material';
import { useColorScheme } from '@mui/material/styles';
import BrightnessAutoRounded from '@mui/icons-material/BrightnessAutoRounded';
import DarkModeRounded from '@mui/icons-material/DarkModeRounded';
import LightModeRounded from '@mui/icons-material/LightModeRounded';
import { duration, easing } from '../theme/motion';

const NEXT = { system: 'light', light: 'dark', dark: 'system' };
const LABEL = { system: 'Tema do sistema', light: 'Tema claro', dark: 'Tema escuro' };
const ICON = { system: BrightnessAutoRounded, light: LightModeRounded, dark: DarkModeRounded };

/** Cycles system → light → dark. The choice is persisted by MUI in localStorage. */
export default function ColorModeToggle() {
  const { mode, setMode } = useColorScheme();
  if (!mode) return null;
  const Icon = ICON[mode];

  return (
    <Tooltip title={`${LABEL[mode]} (clique para alternar)`}>
      <IconButton onClick={() => setMode(NEXT[mode])} aria-label={LABEL[mode]}>
        <Icon
          key={mode}
          sx={{
            animation: `faisca-spin-in ${duration.medium4}ms ${easing.springFast}`,
            '@keyframes faisca-spin-in': {
              from: { transform: 'rotate(-90deg) scale(0.6)', opacity: 0 },
              to: { transform: 'none', opacity: 1 },
            },
          }}
        />
      </IconButton>
    </Tooltip>
  );
}
