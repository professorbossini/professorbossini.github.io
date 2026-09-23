import HomeOutlined from '@mui/icons-material/HomeOutlined'
import HubOutlined from '@mui/icons-material/HubOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import MusicNoteOutlined from '@mui/icons-material/MusicNoteOutlined'
import Hero from './components/Hero'
import Links from './components/Links'
import Trajetoria from './components/Trajetoria'
import Galeria from './components/Galeria'

export const secoes = [
  { id: 'inicio', rotulo: 'Início', icone: HomeOutlined, componente: Hero },
  { id: 'conecte-se', rotulo: 'Onde me encontrar', icone: HubOutlined, componente: Links },
  { id: 'formacao', rotulo: 'Formação', icone: SchoolOutlined, componente: Trajetoria },
  { id: 'musica', rotulo: 'Fora da sala de aula', icone: MusicNoteOutlined, componente: Galeria },
]

export const idsSecoes = secoes.map((s) => s.id)
