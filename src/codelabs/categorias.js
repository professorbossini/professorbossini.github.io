import aws from 'devicon/icons/amazonwebservices/amazonwebservices-original-wordmark.svg'

// Categorias da página de codelabs. A chave é o valor usado em "categories:" no codelab.md.
export const categorias = {
  AWS: { nome: 'AWS', descricao: 'Amazon Web Services na prática', logo: aws, cor: '#FF9900' },
}

export const categoriaDe = (codelab) =>
  codelab.categorias.map((c) => categorias[c]).find(Boolean) ?? null
