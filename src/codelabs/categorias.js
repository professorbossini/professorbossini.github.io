import aws from 'devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'
import gitlab from 'devicon/icons/gitlab/gitlab-original.svg'

// Categorias da página de codelabs. A chave é o valor usado em "categories:" no codelab.md;
// um codelab pode ter várias e aparece em todas elas.
export const categorias = {
  AWS: { nome: 'AWS', descricao: 'Amazon Web Services na prática', logo: aws, cor: '#FF9900' },
  GitLab: { nome: 'GitLab', descricao: 'Repositórios e pipelines de CI/CD', logo: gitlab, cor: '#FC6D26' },
}

// Todas as categorias conhecidas de um codelab, na ordem do codelab.md
export const categoriasDe = (codelab) => codelab.categorias.map((c) => categorias[c]).filter(Boolean)

export const categoriaDe = (codelab) => categoriasDe(codelab)[0] ?? null
