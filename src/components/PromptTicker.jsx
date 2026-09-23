import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import AutoAwesome from '@mui/icons-material/AutoAwesome'
import { aiGradient, fontMono } from '../theme'

// Pílula no estilo "prompt" que digita e apaga os tópicos em sequência.
export default function PromptTicker({ words }) {
  const [index, setIndex] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index]
    let delay = deleting ? 35 : 70
    if (!deleting && text === word) delay = 1800

    const timer = setTimeout(() => {
      if (!deleting && text === word) return setDeleting(true)
      if (deleting && text === '') {
        setDeleting(false)
        return setIndex((index + 1) % words.length)
      }
      setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, delay)
    return () => clearTimeout(timer)
  }, [text, deleting, index, words])

  return (
    <Box
      role="status"
      aria-label={`Ensinando ${words.join(', ')}`}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 1.25,
        px: 2.5,
        py: 1.25,
        borderRadius: 999,
        border: '1px solid transparent',
        background: `linear-gradient(var(--mui-palette-background-paper), var(--mui-palette-background-paper)) padding-box, ${aiGradient} border-box`,
        boxShadow: '0 8px 32px var(--mui-palette-surface-glow)',
        maxWidth: '100%',
      }}
    >
      <AutoAwesome
        sx={{
          fontSize: 20,
          color: 'primary.main',
          '@keyframes sparkle': {
            '0%, 100%': { transform: 'rotate(0deg) scale(1)' },
            '50%': { transform: 'rotate(20deg) scale(1.15)' },
          },
          animation: 'sparkle 2.4s ease-in-out infinite',
        }}
      />
      <Typography component="span" sx={{ color: 'text.secondary', whiteSpace: 'nowrap' }}>
        Ensinando
      </Typography>
      <Typography
        component="span"
        aria-hidden
        sx={{
          fontFamily: fontMono,
          fontWeight: 500,
          whiteSpace: 'nowrap',
          '&::after': {
            content: '""',
            display: 'inline-block',
            width: '2px',
            height: '1.1em',
            ml: '2px',
            verticalAlign: 'text-bottom',
            bgcolor: 'primary.main',
            '@keyframes blink': { '50%': { opacity: 0 } },
            animation: 'blink 1s steps(1) infinite',
          },
        }}
      >
        {text}
      </Typography>
    </Box>
  )
}
