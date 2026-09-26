import { useEffect, useState } from 'react'
import FunctionsOutlined from '@mui/icons-material/FunctionsOutlined'
import WidgetsOutlined from '@mui/icons-material/WidgetsOutlined'
import WarehouseOutlined from '@mui/icons-material/WarehouseOutlined'
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined'
import ExtensionOutlined from '@mui/icons-material/ExtensionOutlined'
import AllInclusiveOutlined from '@mui/icons-material/AllInclusiveOutlined'
import MenuBookOutlined from '@mui/icons-material/MenuBookOutlined'
import AssignmentOutlined from '@mui/icons-material/AssignmentOutlined'
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined'
import BuildOutlined from '@mui/icons-material/BuildOutlined'
import TouchAppOutlined from '@mui/icons-material/TouchAppOutlined'
import CloudOutlined from '@mui/icons-material/CloudOutlined'
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined'
import PsychologyOutlined from '@mui/icons-material/PsychologyOutlined'
import HubOutlined from '@mui/icons-material/HubOutlined'
import DnsOutlined from '@mui/icons-material/DnsOutlined'
import ClassOutlined from '@mui/icons-material/ClassOutlined'
import AccountTreeOutlined from '@mui/icons-material/AccountTreeOutlined'
import StorageOutlined from '@mui/icons-material/StorageOutlined'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import FolderOutlined from '@mui/icons-material/FolderOutlined'
import react from 'devicon/icons/react/react-original.svg'
import java from 'devicon/icons/java/java-original.svg'
import docker from 'devicon/icons/docker/docker-original.svg'
import git from 'devicon/icons/git/git-original.svg'
import postgresql from 'devicon/icons/postgresql/postgresql-original.svg'
import typescript from 'devicon/icons/typescript/typescript-original.svg'
import nodejs from 'devicon/icons/nodejs/nodejs-original.svg'
import django from 'devicon/icons/django/django-plain.svg'
import flutter from 'devicon/icons/flutter/flutter-original.svg'
import graphql from 'devicon/icons/graphql/graphql-plain.svg'
import html5 from 'devicon/icons/html5/html5-original.svg'
import javascript from 'devicon/icons/javascript/javascript-original.svg'
import nextjs from 'devicon/icons/nextjs/nextjs-original.svg'
import githubactions from 'devicon/icons/githubactions/githubactions-original.svg'
import aws from 'devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'

import { PCLOUD_API, pcloudRaiz, urlPasta } from './pcloud'

export { pcloudRaiz }

export const categorias = ['Linguagens', 'Web e mobile', 'Dados e IA', 'Cloud e DevOps', 'Fundamentos', 'Turmas e instituições']

// Nome bonito, categoria e ícone de cada pasta do pCloud.
// `logo` é o logo oficial da tecnologia (Devicon); `icone` é um ícone Material.
// `filtroEscuro` ajusta logos escuros demais para o tema escuro.
const catalogo = {
  administracao_de_dados: { nome: 'Administração de Dados', categoria: 'Dados e IA', icone: StorageOutlined },
  analise_de_algoritmos: { nome: 'Análise de Algoritmos', categoria: 'Fundamentos', icone: FunctionsOutlined },
  app_inventor: { nome: 'App Inventor', categoria: 'Web e mobile', icone: WidgetsOutlined },
  // o texto do logo da AWS é escuro: no tema escuro inverte só a luminosidade, mantendo o laranja
  aws: { nome: 'AWS', categoria: 'Cloud e DevOps', logo: aws, filtroEscuro: 'invert(1) hue-rotate(180deg)' },
  chatgpt: { nome: 'ChatGPT', categoria: 'Dados e IA', icone: AutoAwesomeOutlined },
  dart_flutter: { nome: 'Dart e Flutter', categoria: 'Web e mobile', logo: flutter },
  data_warehouse: { nome: 'Data Warehouse', categoria: 'Dados e IA', icone: WarehouseOutlined },
  desenvolvimento_de_aplicativos_hibridos: { nome: 'Aplicativos Híbridos', categoria: 'Web e mobile', icone: PhoneIphoneOutlined },
  design_patterns: { nome: 'Design Patterns', categoria: 'Fundamentos', icone: ExtensionOutlined },
  devops: { nome: 'DevOps', categoria: 'Cloud e DevOps', icone: AllInclusiveOutlined },
  disciplinas: { nome: 'Disciplinas', categoria: 'Turmas e instituições', icone: MenuBookOutlined },
  django: { nome: 'Django', categoria: 'Web e mobile', logo: django, filtroEscuro: 'brightness(0) invert(1)' },
  docker: { nome: 'Docker', categoria: 'Cloud e DevOps', logo: docker },
  exercicio_feriado: { nome: 'Exercício de Feriado', categoria: 'Turmas e instituições', icone: AssignmentOutlined },
  fatec: { nome: 'FATEC', categoria: 'Turmas e instituições', icone: AccountBalanceOutlined },
  git: { nome: 'Git', categoria: 'Cloud e DevOps', logo: git },
  github_actions: { nome: 'GitHub Actions', categoria: 'Cloud e DevOps', logo: githubactions },
  graphql: { nome: 'GraphQL', categoria: 'Web e mobile', logo: graphql },
  handson: { nome: 'Hands-on', categoria: 'Turmas e instituições', icone: BuildOutlined },
  html_css_bootstrap: { nome: 'HTML, CSS e Bootstrap', categoria: 'Web e mobile', logo: html5 },
  ihc: { nome: 'Interação Humano-Computador', categoria: 'Fundamentos', icone: TouchAppOutlined },
  infraestrutura_de_redes_nuvem_e_seguranca_para_ti: { nome: 'Redes, Nuvem e Segurança', categoria: 'Cloud e DevOps', icone: CloudOutlined },
  insight: { nome: 'Insight', categoria: 'Turmas e instituições', icone: LightbulbOutlined },
  java: { nome: 'Java', categoria: 'Linguagens', logo: java },
  javascript: { nome: 'JavaScript', categoria: 'Linguagens', logo: javascript },
  machine_learning: { nome: 'Machine Learning', categoria: 'Dados e IA', icone: PsychologyOutlined },
  maua: { nome: 'Mauá', categoria: 'Turmas e instituições', icone: AccountBalanceOutlined },
  microsservicos: { nome: 'Microsserviços', categoria: 'Cloud e DevOps', icone: HubOutlined },
  nextjs: { nome: 'Next.js', categoria: 'Web e mobile', logo: nextjs, filtroEscuro: 'invert(1)' },
  nodejs: { nome: 'Node.js', categoria: 'Web e mobile', logo: nodejs },
  postgresql: { nome: 'PostgreSQL', categoria: 'Dados e IA', logo: postgresql },
  react: { nome: 'React', categoria: 'Web e mobile', logo: react },
  react_native: { nome: 'React Native', categoria: 'Web e mobile', logo: react },
  topicos_avancados_em_backend: { nome: 'Tópicos Avançados em Back-end', categoria: 'Web e mobile', icone: DnsOutlined },
  tti101: { nome: 'TTI101', categoria: 'Turmas e instituições', icone: ClassOutlined },
  tti107_ads2001: { nome: 'TTI107 · ADS2001', categoria: 'Turmas e instituições', icone: ClassOutlined },
  typescript: { nome: 'TypeScript', categoria: 'Linguagens', logo: typescript },
  unip: { nome: 'UNIP', categoria: 'Turmas e instituições', icone: AccountBalanceOutlined },
  usjt: { nome: 'USJT', categoria: 'Turmas e instituições', icone: AccountBalanceOutlined },
  zookeeper: { nome: 'ZooKeeper', categoria: 'Cloud e DevOps', icone: AccountTreeOutlined },
}

// Pastas novas no pCloud que ainda não estão no catálogo aparecem com nome derivado e ícone de pasta.
const nomeDerivado = (nome) => nome.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase())

const TRINTA_DIAS = 30 * 24 * 60 * 60 * 1000

const paraPasta = (item) => {
  const info = catalogo[item.name] ?? { nome: nomeDerivado(item.name), categoria: null, icone: FolderOutlined }
  const modificado = new Date(item.modified)
  return {
    ...info,
    id: item.folderid,
    itens: item.contents?.length ?? 0,
    modificado,
    novo: Date.now() - modificado.getTime() < TRINTA_DIAS,
    url: urlPasta(item.folderid),
  }
}

// Busca a lista de pastas uma vez por visita e reaproveita ao voltar para a página.
let cache = null

export function usePastas() {
  const [estado, setEstado] = useState(cache ? { status: 'ok', pastas: cache } : { status: 'carregando' })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    if (cache) return
    let cancelado = false
    fetch(PCLOUD_API)
      .then((r) => r.json())
      .then((dados) => {
        if (dados.result !== 0) throw new Error(dados.error)
        cache = dados.metadata.contents.filter((item) => item.isfolder).map(paraPasta)
        if (!cancelado) setEstado({ status: 'ok', pastas: cache })
      })
      .catch(() => !cancelado && setEstado({ status: 'erro' }))
    return () => {
      cancelado = true
    }
  }, [tentativa])

  const tentarDeNovo = () => {
    setEstado({ status: 'carregando' })
    setTentativa((t) => t + 1)
  }

  return { ...estado, tentarDeNovo }
}

