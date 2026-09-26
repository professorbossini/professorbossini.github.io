import { useState } from 'react';
import { Box, Link, Tooltip, Typography } from '@mui/material';
import { duration, easing } from '../../theme/motion';
import { FaiscaMark } from './FaiscaMark';

export const FAISCA_REPO_URL = 'https://github.com/professorbossini/faisca-auth-starter';

/**
 * Selo "feito com Faísca" fixo no canto inferior: o visual deste site vem do
 * tema do template Faísca. Portado de src/components/brand/PoweredByFaisca.tsx.
 */
export function PoweredByFaisca({ sx }) {
  const [hover, setHover] = useState(false);

  return (
    <Tooltip title="O visual deste site vem do tema Faísca. Ver no GitHub" placement="top-end">
      <Link
        href={FAISCA_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        underline="none"
        aria-label="Feito com Faísca (abre o repositório no GitHub)"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onFocus={() => setHover(true)}
        onBlur={() => setHover(false)}
        sx={[
          (theme) => ({
            position: 'fixed',
            right: 16,
            bottom: 16,
            zIndex: theme.zIndex.speedDial,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1,
            height: 36,
            pl: 0.625,
            // Compact (spark only) on phones so it doesn't cover content.
            pr: { xs: 0.625, sm: 1.5 },
            borderRadius: 99,
            overflow: 'hidden',
            color: 'text.secondary',
            bgcolor: theme.alpha(theme.vars.palette.background.paper, 0.72),
            backdropFilter: 'saturate(180%) blur(12px)',
            border: `1px solid ${theme.vars.palette.divider}`,
            boxShadow: `0 6px 20px -10px ${theme.alpha('#140E26', 0.35)}`,
            animation: `faisca-badge-in ${duration.long2}ms ${easing.emphasizedDecelerate} 600ms backwards`,
            transition: [
              `transform ${duration.medium2}ms ${easing.springFast}`,
              `box-shadow ${duration.medium1}ms ${easing.standard}`,
              `border-color ${duration.medium1}ms ${easing.standard}`,
            ].join(', '),
            '@keyframes faisca-badge-in': {
              from: { opacity: 0, transform: 'translateY(12px) scale(0.96)' },
              to: { opacity: 1, transform: 'none' },
            },
            // Light sweep across the pill on hover.
            '&::after': {
              content: '""',
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(105deg, transparent 35%, ${theme.alpha('#C6EF34', 0.35)} 50%, transparent 65%)`,
              transform: 'translateX(-120%)',
              pointerEvents: 'none',
            },
            '&:hover, &:focus-visible': {
              transform: 'translateY(-2px)',
              borderColor: theme.alpha('#C6EF34', 0.7),
              boxShadow: `0 10px 28px -8px ${theme.alpha('#C6EF34', 0.55)}`,
            },
            '&:hover::after, &:focus-visible::after': {
              transition: `transform ${duration.long4 * 1.5}ms ${easing.standard}`,
              transform: 'translateX(120%)',
            },
          }),
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <FaiscaMark size={26} animated={hover} />
        <Typography
          component="span"
          sx={{
            display: { xs: 'none', sm: 'inline' },
            fontSize: '0.8125rem',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          feito com{' '}
          <Box
            component="strong"
            sx={(theme) => ({
              fontWeight: 700,
              fontVariationSettings: "'ROND' 100",
              backgroundImage: `linear-gradient(90deg, ${theme.vars.palette.primary.main}, #7649CF)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              ...theme.applyStyles('dark', {
                backgroundImage: 'linear-gradient(90deg, #D4F45E, #BBA4EE)',
              }),
            })}
          >
            Faísca
          </Box>
        </Typography>
      </Link>
    </Tooltip>
  );
}
