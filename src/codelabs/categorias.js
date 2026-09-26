import FunctionsOutlined from '@mui/icons-material/FunctionsOutlined'
import StorageOutlined from '@mui/icons-material/StorageOutlined'
import AutoAwesomeOutlined from '@mui/icons-material/AutoAwesomeOutlined'
import AllInclusiveOutlined from '@mui/icons-material/AllInclusiveOutlined'
import HubOutlined from '@mui/icons-material/HubOutlined'
import BoltOutlined from '@mui/icons-material/BoltOutlined'
import AccessibilityNewOutlined from '@mui/icons-material/AccessibilityNewOutlined'
import PhoneIphoneOutlined from '@mui/icons-material/PhoneIphoneOutlined'
import aws from 'devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'
import gitlab from 'devicon/icons/gitlab/gitlab-original.svg'
import git from 'devicon/icons/git/git-original.svg'
import docker from 'devicon/icons/docker/docker-original.svg'
import kubernetes from 'devicon/icons/kubernetes/kubernetes-original.svg'
import java from 'devicon/icons/java/java-original.svg'
import python from 'devicon/icons/python/python-original.svg'
import javascript from 'devicon/icons/javascript/javascript-original.svg'
import nodejs from 'devicon/icons/nodejs/nodejs-original.svg'
import react from 'devicon/icons/react/react-original.svg'
import redux from 'devicon/icons/redux/redux-original.svg'
import flutter from 'devicon/icons/flutter/flutter-original.svg'
import django from 'devicon/icons/django/django-plain.svg'
import postgresql from 'devicon/icons/postgresql/postgresql-original.svg'
import mysql from 'devicon/icons/mysql/mysql-original.svg'
import mongodb from 'devicon/icons/mongodb/mongodb-original.svg'
import firebase from 'devicon/icons/firebase/firebase-original.svg'
import graphql from 'devicon/icons/graphql/graphql-plain.svg'
import html5 from 'devicon/icons/html5/html5-original.svg'
import bootstrap from 'devicon/icons/bootstrap/bootstrap-original.svg'

// Categorias da página de codelabs, na ordem em que aparecem no menu. A chave é o valor usado
// em "categories:" no codelab.md; um codelab pode ter várias e aparece em todas elas.
// `logo` é o logo oficial (Devicon); sem logo oficial, `icone` é um ícone Material com `cor`.
export const categorias = {
  AWS: { nome: 'AWS', logo: aws, cor: '#FF9900' },
  Serverless: { nome: 'Serverless', icone: BoltOutlined, cor: '#FF9900' },
  GitLab: { nome: 'GitLab', logo: gitlab, cor: '#FC6D26' },
  Git: { nome: 'Git', logo: git, cor: '#F05032' },
  DevOps: { nome: 'DevOps', icone: AllInclusiveOutlined, cor: '#5B2DB0' },
  Docker: { nome: 'Docker', logo: docker, cor: '#2496ED' },
  Kubernetes: { nome: 'Kubernetes', logo: kubernetes, cor: '#326CE5' },
  Microsserviços: { nome: 'Microsserviços', icone: HubOutlined, cor: '#7649CF' },
  Algoritmos: { nome: 'Algoritmos', icone: FunctionsOutlined, cor: '#5B2DB0' },
  Java: { nome: 'Java', logo: java, cor: '#E76F00' },
  Python: { nome: 'Python', logo: python, cor: '#3776AB' },
  JavaScript: { nome: 'JavaScript', logo: javascript, cor: '#F7DF1E' },
  'Node.js': { nome: 'Node.js', logo: nodejs, cor: '#5FA04E' },
  'HTML e CSS': { nome: 'HTML e CSS', logo: html5, cor: '#E34F26' },
  Bootstrap: { nome: 'Bootstrap', logo: bootstrap, cor: '#7952B3' },
  Acessibilidade: { nome: 'Acessibilidade', icone: AccessibilityNewOutlined, cor: '#0B7A75' },
  React: { nome: 'React', logo: react, cor: '#61DAFB' },
  Redux: { nome: 'Redux', logo: redux, cor: '#764ABC' },
  'React Native': { nome: 'React Native', logo: react, cor: '#61DAFB' },
  Flutter: { nome: 'Flutter', logo: flutter, cor: '#02569B' },
  Mobile: { nome: 'Mobile', icone: PhoneIphoneOutlined, cor: '#5B2DB0' },
  Django: { nome: 'Django', logo: django, cor: '#092E20' },
  GraphQL: { nome: 'GraphQL', logo: graphql, cor: '#E10098' },
  'Bancos de Dados': { nome: 'Bancos de Dados', icone: StorageOutlined, cor: '#5B2DB0' },
  PostgreSQL: { nome: 'PostgreSQL', logo: postgresql, cor: '#4169E1' },
  MySQL: { nome: 'MySQL', logo: mysql, cor: '#4479A1' },
  MongoDB: { nome: 'MongoDB', logo: mongodb, cor: '#47A248' },
  Firebase: { nome: 'Firebase', logo: firebase, cor: '#FFCA28' },
  IA: { nome: 'IA', icone: AutoAwesomeOutlined, cor: '#7649CF' },
}

// Todas as categorias conhecidas de um codelab, na ordem do codelab.md
export const categoriasDe = (codelab) => codelab.categorias.map((c) => categorias[c]).filter(Boolean)

export const categoriaDe = (codelab) => categoriasDe(codelab)[0] ?? null
