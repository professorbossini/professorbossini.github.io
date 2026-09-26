import { lazy } from 'react'
import HomeOutlined from '@mui/icons-material/HomeOutlined'
import ShareOutlined from '@mui/icons-material/ShareOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import MusicNoteOutlined from '@mui/icons-material/MusicNoteOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import ScienceOutlined from '@mui/icons-material/ScienceOutlined'
import Hero from './components/Hero'
import Links from './components/Links'
import Trajetoria from './components/Trajetoria'
import Galeria from './components/Galeria'

// A página de material é carregada só quando aberta (ícones e lógica de busca pesam no bundle)
const Material = lazy(() => import('./components/Material'))
const CodelabsHome = lazy(() => import('./components/codelabs/CodelabsHome'))

export const secoes = [
  { id: 'inicio', rotulo: 'Início', icone: HomeOutlined, componente: Hero },
  { id: 'material', rotulo: 'Material didático', icone: MenuBookOutlined, componente: Material },
  { id: 'codelabs', rotulo: 'Codelabs', icone: ScienceOutlined, componente: CodelabsHome, largura: 'lg' },
  { id: 'redes', rotulo: 'Redes sociais', icone: ShareOutlined, componente: Links },
  { id: 'formacao', rotulo: 'Formação', icone: SchoolOutlined, componente: Trajetoria },
  { id: 'musica', rotulo: 'Fora da sala de aula', icone: MusicNoteOutlined, componente: Galeria },
]

export const idsSecoes = secoes.map((s) => s.id)
