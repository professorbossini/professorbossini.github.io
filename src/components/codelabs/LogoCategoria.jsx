import { Box } from '@mui/material'
import AppsOutlined from '@mui/icons-material/AppsOutlined'

// Logo da categoria num quadrado claro (o texto do logo da AWS é escuro)
export default function LogoCategoria({ categoria, tamanho = 40 }) {
  if (!categoria) return <AppsOutlined />
  return (
    <Box
      sx={{
        width: tamanho,
        height: tamanho,
        flexShrink: 0,
        borderRadius: `${tamanho * 0.28}px`,
        bgcolor: '#fff',
        border: '1px solid',
        borderColor: 'divider',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      {categoria.logo ? (
        <Box component="img" src={categoria.logo} alt="" sx={{ width: '72%', height: '72%', objectFit: 'contain' }} />
      ) : (
        <categoria.icone sx={{ fontSize: tamanho * 0.62, color: categoria.cor }} />
      )}
    </Box>
  )
}
