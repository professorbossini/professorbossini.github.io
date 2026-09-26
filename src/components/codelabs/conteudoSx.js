import { monoFontFamily, tokens } from '../../theme'

const { ink, lime, violet } = tokens

// Estilos do HTML de um passo de codelab (gerado a partir do Markdown), no visual Faísca.
export const conteudoSx = (theme) => ({
  fontSize: '1.0625rem',
  lineHeight: 1.7,
  overflowWrap: 'anywhere',
  '& > :first-of-type': { mt: 0 },
  '& h3': { ...theme.typography.h5, mt: 5, mb: 1.5 },
  '& h4': { ...theme.typography.h6, mt: 3, mb: 1 },
  '& p': { my: 2 },
  '& ul, & ol': { pl: 3.5, my: 2, '& li': { my: 0.75 }, '& li::marker': { color: theme.vars.palette.primary.main } },
  '& a': { color: theme.vars.palette.primary.main, fontWeight: 600, textUnderlineOffset: 3 },
  '& strong': { fontWeight: 650 },
  '& hr': { border: 0, borderTop: `1px solid ${theme.vars.palette.divider}`, my: 4 },

  // código inline
  '& :not(pre) > code': {
    fontFamily: monoFontFamily,
    fontSize: '0.875em',
    px: 0.75,
    py: 0.25,
    borderRadius: '6px',
    bgcolor: theme.vars.palette.neutral.container,
    color: theme.vars.palette.primary.dark,
    ...theme.applyStyles('dark', { color: theme.vars.palette.primary.light }),
  },

  // rótulo acima do bloco de código ("CloudShell", "app.js"...)
  '& p:has(> strong:only-child):has(+ .bloco-codigo)': {
    mb: 0.75,
    fontFamily: monoFontFamily,
    fontSize: '0.8125rem',
    color: theme.vars.palette.text.secondary,
    '& strong': { fontWeight: 500 },
  },

  // blocos de código: sempre escuros, com as cores lima e violeta da marca
  '& .bloco-codigo': {
    position: 'relative',
    my: 2,
    borderRadius: '14px',
    bgcolor: ink[900],
    border: `1px solid ${ink[800]}`,
    '&:hover .copiar, & .copiar:focus-visible': { opacity: 1 },
  },
  '& .bloco-codigo pre': {
    m: 0,
    p: 2.25,
    pr: 9,
    overflowX: 'auto',
    fontFamily: monoFontFamily,
    fontSize: '0.875rem',
    lineHeight: 1.65,
    color: '#F4F1FB',
  },
  '& .copiar': {
    position: 'absolute',
    top: 10,
    right: 10,
    opacity: 0.7,
    cursor: 'pointer',
    font: 'inherit',
    fontSize: '0.75rem',
    fontWeight: 600,
    px: 1.25,
    py: 0.5,
    borderRadius: '8px',
    border: `1px solid ${ink[700]}`,
    color: ink[200],
    bgcolor: ink[850],
    transition: 'opacity 150ms, background-color 150ms, color 150ms',
    '&:hover': { bgcolor: ink[800], color: '#fff' },
    '&.copiado': { opacity: 1, color: violet[900], bgcolor: lime[400], borderColor: lime[400] },
  },
  '& .hljs-comment, & .hljs-quote': { color: ink[400], fontStyle: 'italic' },
  '& .hljs-keyword, & .hljs-selector-tag, & .hljs-literal, & .hljs-built_in': { color: violet[300] },
  '& .hljs-string, & .hljs-attr, & .hljs-template-tag, & .hljs-addition': { color: lime[300] },
  '& .hljs-number, & .hljs-symbol, & .hljs-bullet': { color: '#FFC46B' },
  '& .hljs-title, & .hljs-section, & .hljs-name, & .hljs-selector-class': { color: '#FF8A8F' },
  '& .hljs-variable, & .hljs-params, & .hljs-template-variable, & .hljs-attribute': { color: violet[200] },
  '& .hljs-meta': { color: ink[300] },

  // figuras e legendas (parágrafo só com itálico logo abaixo da imagem)
  '& p:has(> img)': { my: 3, textAlign: 'center' },
  '& img': {
    display: 'block',
    maxWidth: '100%',
    height: 'auto',
    mx: 'auto',
    borderRadius: '12px',
    border: `1px solid ${theme.vars.palette.divider}`,
    bgcolor: '#fff',
  },
  '& p:has(> img) + p:has(> em:only-child)': {
    mt: -1.5,
    textAlign: 'center',
    fontSize: '0.875rem',
    color: theme.vars.palette.text.secondary,
  },

  // tabelas: rolam na horizontal em telas pequenas
  '& .tabela': {
    overflowX: 'auto',
    my: 2.5,
    border: `1px solid ${theme.vars.palette.divider}`,
    borderRadius: '12px',
  },
  '& table': {
    width: '100%',
    borderCollapse: 'collapse',
    fontSize: '0.9375rem',
    lineHeight: 1.5,
  },
  '& th, & td': {
    textAlign: 'left',
    verticalAlign: 'top',
    px: 1.75,
    py: 1.25,
    borderBottom: `1px solid ${theme.vars.palette.divider}`,
  },
  '& tr:last-of-type td': { borderBottom: 0 },
  '& th': { bgcolor: theme.vars.palette.background.subtle, fontWeight: 600, whiteSpace: 'nowrap' },

  // definições (blockquote) e caixas do Google Codelabs (aside positive/negative)
  '& blockquote, & aside': {
    my: 2.5,
    px: 2.5,
    py: 0.25,
    borderRadius: '12px',
    borderLeft: '4px solid',
    '& > p': { my: 1.5 },
  },
  '& blockquote': {
    mx: 0,
    bgcolor: theme.vars.palette.info.container,
    borderColor: theme.vars.palette.info.main,
    '& > p:first-of-type strong': { color: theme.vars.palette.info.onContainer },
  },
  '& aside.positive': {
    bgcolor: theme.vars.palette.success.container,
    borderColor: theme.vars.palette.success.main,
  },
  '& aside.negative': {
    bgcolor: theme.vars.palette.warning.container,
    borderColor: theme.vars.palette.warning.main,
  },
})
