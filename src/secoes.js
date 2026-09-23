import { lazy } from 'react'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import ShareOutlined from '@mui/icons-material/ShareOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import MusicNoteOutlined from '@mui/icons-material/MusicNoteOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import Hero from './components/Hero'
import Links from './components/Links'
import Trajetoria from './components/Trajetoria'
import Galeria from './components/Galeria'

// A página de material é carregada só quando aberta (ícones e lógica de busca pesam no bundle)
const Material = lazy(() => import('./components/Material'))

export const secoes = [
  { id: 'inicio', rotulo: 'Início', curto: 'Início', icone: HomeOutlined, componente: Hero },
  { id: 'material', rotulo: 'Material didático', curto: 'Material', icone: MenuBookOutlined, componente: Material },
  { id: 'redes', rotulo: 'Redes sociais', curto: 'Redes', icone: ShareOutlined, componente: Links },
  { id: 'formacao', rotulo: 'Formação', curto: 'Formação', icone: SchoolOutlined, componente: Trajetoria },
  { id: 'musica', rotulo: 'Fora da sala de aula', curto: 'Música', icone: MusicNoteOutlined, componente: Galeria },
]

export const idsSecoes = secoes.map((s) => s.id)
