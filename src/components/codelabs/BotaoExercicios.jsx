import { useState } from 'react'
import { Button, IconButton, ListItemText, Menu, MenuItem, Tooltip } from '@mui/material'
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined'

// "exercicios_com_respostas_x.pdf" -> "Exercícios com respostas"
function rotulo(caminho) {
  const nome = caminho.split('/').pop().toLowerCase()
  if (/gabarito|respost|soluc|resoluc/.test(nome)) return 'Exercícios com respostas'
  if (/extra/.test(nome)) return 'Exercícios extras'
  return 'Exercícios'
}

// Baixa a(s) lista(s) de exercícios em PDF de um codelab. Com mais de uma, abre um menu.
// variante "botao" (card) ou "icone" (barra do leitor).
export default function BotaoExercicios({ arquivos, onBaixar, baixando, variante = 'botao' }) {
  const [ancora, setAncora] = useState(null)
  if (!arquivos?.length) return null

  const aoClicar = (e) => (arquivos.length === 1 ? onBaixar(arquivos[0]) : setAncora(e.currentTarget))
  const gatilho =
    variante === 'icone' ? (
      <Tooltip title="Baixar os exercícios em PDF">
        <IconButton onClick={aoClicar} disabled={baixando} aria-label="Baixar exercícios">
          <AssignmentOutlined />
        </IconButton>
      </Tooltip>
    ) : (
      <Button variant="tonal" startIcon={<AssignmentOutlined />} onClick={aoClicar} disabled={baixando}>
        Exercícios
      </Button>
    )

  return (
    <>
      {gatilho}
      <Menu anchorEl={ancora} open={!!ancora} onClose={() => setAncora(null)}>
        {arquivos.map((a) => (
          <MenuItem
            key={a}
            onClick={() => {
              setAncora(null)
              onBaixar(a)
            }}
          >
            <ListItemText primary={rotulo(a)} secondary={a.split('/').pop()} />
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}
