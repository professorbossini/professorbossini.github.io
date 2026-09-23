import { useRef, useState } from 'react'
import { Box, ButtonBase, Typography } from '@mui/material'
import { aiGradient, easing } from '../theme'
import { secoes } from '../secoes'

const BASE = { xs: 44, sm: 48 }
const AMPLIACAO = 0.55 // quanto o ícone sob o mouse cresce (55%)
const ALCANCE = 140 // distância, em px, em que os vizinhos ainda crescem

// Escala de cada ícone conforme a distância do mouse, como no dock do macOS.
const escalaPara = (mouseX, elemento) => {
  if (mouseX == null || !elemento) return 1
  const { left, width } = elemento.getBoundingClientRect()
  const distancia = Math.abs(mouseX - (left + width / 2))
  return 1 + AMPLIACAO * Math.max(0, 1 - distancia / ALCANCE)
}

export default function Dock({ rota, onNavegar }) {
  const [mouseX, setMouseX] = useState(null)
  const refs = useRef([])
  // só amplia com mouse de verdade e sem "reduzir movimento"
  const podeAmpliar = () =>
    window.matchMedia('(hover: hover) and (prefers-reduced-motion: no-preference)').matches

  return (
    <Box
      component="nav"
      aria-label="Seções do site"
      onMouseMove={(e) => podeAmpliar() && setMouseX(e.clientX)}
      onMouseLeave={() => setMouseX(null)}
      sx={{
        position: 'fixed',
        bottom: { xs: 12, sm: 20 },
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 20,
        display: 'flex',
        alignItems: 'flex-end',
        gap: { xs: 0.5, sm: 1 },
        px: { xs: 1, sm: 1.5 },
        pt: 1,
        pb: 0.75,
        maxWidth: 'calc(100vw - 24px)',
        borderRadius: '26px',
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: 'color-mix(in srgb, var(--mui-palette-surface-container) 72%, transparent)',
        backdropFilter: 'blur(20px) saturate(160%)',
        boxShadow: '0 12px 40px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.04) inset',
      }}
    >
      {secoes.map(({ id, rotulo, curto, icone: Icone }, i) => {
        const ativo = rota === id
        const escala = escalaPara(mouseX, refs.current[i])
        return (
            <ButtonBase
              key={id}
              ref={(el) => (refs.current[i] = el)}
              onClick={() => onNavegar(id)}
              aria-current={ativo ? 'page' : undefined}
              aria-label={rotulo}
              sx={{
                flexDirection: 'column',
                alignItems: 'center',
                gap: 0.5,
                borderRadius: '14px',
                px: { xs: 0.25, sm: 0.5 },
              }}
            >
              <Box
                sx={{
                  width: BASE,
                  height: BASE,
                  // cresce para cima a partir da base, e a margem lateral empurra os vizinhos
                  transform: `scale(${escala})`,
                  transformOrigin: 'bottom center',
                  mx: `${(escala - 1) * 24}px`,
                  transition: mouseX == null
                    ? `transform 300ms ${easing.emphasized}, margin 300ms ${easing.emphasized}`
                    : 'transform 80ms linear, margin 80ms linear',
                  borderRadius: '14px',
                  display: 'grid',
                  placeItems: 'center',
                  color: ativo ? '#fff' : 'text.primary',
                  background: ativo ? aiGradient : 'var(--mui-palette-surface-containerHigh)',
                  boxShadow: ativo ? '0 6px 18px var(--mui-palette-surface-glow)' : 'none',
                }}
              >
                <Icone sx={{ fontSize: { xs: 22, sm: 24 } }} />
              </Box>
              <Typography
                component="span"
                sx={{
                  fontSize: { xs: 10.5, sm: 11.5 },
                  fontWeight: ativo ? 600 : 500,
                  color: ativo ? 'text.primary' : 'text.secondary',
                  lineHeight: 1.2,
                  whiteSpace: 'nowrap',
                }}
              >
                {curto}
              </Typography>
              {/* pontinho de "app aberto" do dock */}
              <Box
                sx={{
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  bgcolor: 'text.primary',
                  opacity: ativo ? 0.9 : 0,
                  transition: 'opacity 200ms',
                }}
              />
            </ButtonBase>
        )
      })}
    </Box>
  )
}
