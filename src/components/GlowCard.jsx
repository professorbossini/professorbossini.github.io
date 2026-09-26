import { Card, CardActionArea } from '@mui/material'
import { transition } from '../theme'

// Card do tema Faísca (outlined) que sobe e ganha brilho na cor primária ao passar o mouse,
// como o selo "feito com Faísca". `featured` deixa a borda primária sempre visível.
export default function GlowCard({ href, featured = false, children, sx }) {
  return (
    <Card
      sx={[
        (theme) => ({
          height: '100%',
          borderWidth: featured ? 1.5 : 1,
          borderColor: featured ? theme.vars.palette.primary.main : theme.vars.palette.divider,
          transition: [
            transition(['border-color', 'box-shadow'], 'medium1'),
            transition('transform', 'medium2', 'springFast'),
          ].join(', '),
          '&:hover': {
            transform: 'translateY(-3px)',
            borderColor: theme.alpha(theme.vars.palette.primary.main, 0.7),
            boxShadow: `0 12px 32px -10px ${theme.alpha(theme.vars.palette.primary.main, 0.45)}`,
          },
        }),
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      <CardActionArea
        href={href}
        target="_blank"
        rel="noopener"
        sx={{ height: '100%', p: 3, alignItems: 'flex-start' }}
      >
        {children}
      </CardActionArea>
    </Card>
  )
}
