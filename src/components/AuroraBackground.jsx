import { Box } from '@mui/material';

/**
 * Soft, slowly drifting lime/violet glow behind auth screens. A nod to the
 * luminous gradients of Google's AI materials. Purely decorative; animation
 * stops automatically with prefers-reduced-motion.
 */
export default function AuroraBackground() {
  const blob = {
    position: 'absolute',
    borderRadius: '50%',
    filter: 'blur(80px)',
    willChange: 'transform',
  };

  return (
    <Box
      aria-hidden
      sx={(theme) => ({
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        overflow: 'hidden',
        backgroundColor: theme.vars.palette.background.default,
        '@keyframes faisca-drift-a': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '50%': { transform: 'translate(8vw, 6vh) scale(1.15)' },
        },
        '@keyframes faisca-drift-b': {
          '0%, 100%': { transform: 'translate(0, 0) scale(1.1)' },
          '50%': { transform: 'translate(-10vw, -4vh) scale(0.95)' },
        },
      })}
    >
      <Box
        sx={(theme) => ({
          ...blob,
          width: '48vmax',
          height: '48vmax',
          top: '-18vmax',
          left: '-12vmax',
          background: theme.alpha(theme.vars.palette.lime.main, 0.28),
          animation: 'faisca-drift-a 22s ease-in-out infinite',
          ...theme.applyStyles('dark', {
            background: theme.alpha(theme.vars.palette.lime.main, 0.07),
          }),
        })}
      />
      <Box
        sx={(theme) => ({
          ...blob,
          width: '54vmax',
          height: '54vmax',
          bottom: '-24vmax',
          right: '-16vmax',
          background: theme.alpha('#7649CF', 0.22),
          animation: 'faisca-drift-b 26s ease-in-out infinite',
          ...theme.applyStyles('dark', { background: theme.alpha('#7649CF', 0.36) }),
        })}
      />
    </Box>
  );
}
