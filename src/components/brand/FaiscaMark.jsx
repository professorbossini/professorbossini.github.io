import { useId } from 'react';
import { Box } from '@mui/material';

const INK = '#2A1263';

/** Sparks flying off the core, as [x1, y1, x2, y2] strokes and [cx, cy] particles (viewBox 48×48). */
const RAYS = [
  [28.8, 19.2, 34.4, 13.6],
  [31.8, 25.1, 36.8, 24.2],
  [22.9, 16.2, 23.8, 11.2],
];
const PARTICLES = [
  [37.8, 17.1],
  [30.9, 10.2],
];

/**
 * Faísca brand mark: a gem-like core throwing sparks to the upper right,
 * the moment an idea ignites. Legible down to 16px. Replace this component
 * (and public/favicon.svg) to rebrand the template.
 */
/**
 * @param size tamanho em px; @param animated faz as faíscas cintilarem
 */
export function FaiscaMark({ size = 40, animated = false, sx }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, '');
  const tileId = `faisca-tile-${uid}`;

  return (
    <Box
      component="svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      aria-hidden="true"
      sx={[
        { display: 'block', flexShrink: 0 },
        animated && {
          '& .faisca-core': {
            transformBox: 'fill-box',
            transformOrigin: 'center',
            animation: 'faisca-pulse 1.6s cubic-bezier(0.2, 0, 0, 1) infinite',
          },
          '& .faisca-spark': {
            transformOrigin: '21px 27px',
            animation: 'faisca-flicker 1.6s cubic-bezier(0.05, 0.7, 0.1, 1) infinite both',
          },
          '@keyframes faisca-pulse': {
            '0%, 100%': { transform: 'rotate(45deg) scale(1)' },
            '40%': { transform: 'rotate(45deg) scale(0.86)' },
          },
          '@keyframes faisca-flicker': {
            '0%': { opacity: 0, transform: 'scale(0.6)' },
            '35%': { opacity: 1, transform: 'scale(1)' },
            '100%': { opacity: 0, transform: 'scale(1.25)' },
          },
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <defs>
        <linearGradient id={tileId} x1="6" y1="4" x2="42" y2="46" gradientUnits="userSpaceOnUse">
          <stop stopColor="#DDFB6A" />
          <stop offset="1" stopColor="#B4E21C" />
        </linearGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill={`url(#${tileId})`} />
      {animated ? (
        <rect className="faisca-core" x="15" y="21" width="12" height="12" rx="3.4" fill={INK} />
      ) : (
        <rect
          x="15"
          y="21"
          width="12"
          height="12"
          rx="3.4"
          transform="rotate(45 21 27)"
          fill={INK}
        />
      )}
      <g stroke={INK} strokeWidth="3" strokeLinecap="round" fill={INK}>
        {RAYS.map(([x1, y1, x2, y2], i) => (
          <path
            key={x1}
            className="faisca-spark"
            d={`M${x1} ${y1} ${x2} ${y2}`}
            style={animated ? { animationDelay: `${i * 0.12}s` } : undefined}
          />
        ))}
        {PARTICLES.map(([cx, cy], i) => (
          <circle
            key={cx}
            className="faisca-spark"
            cx={cx}
            cy={cy}
            r="1.7"
            stroke="none"
            style={animated ? { animationDelay: `${(RAYS.length + i) * 0.12}s` } : undefined}
          />
        ))}
      </g>
    </Box>
  );
}
