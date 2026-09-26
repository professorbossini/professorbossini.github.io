// Link público do pCloud com o material didático e acesso à API pública dele.
export const PCLOUD_CODE = 'kZFaJwVZAgJbR8eJaa4FMBBqOpfktBWP27uk'
export const PCLOUD_API = `https://api.pcloud.com/showpublink?code=${PCLOUD_CODE}`
export const pcloudRaiz = `https://u.pcloud.link/publink/show?code=${PCLOUD_CODE}`
export const urlPasta = (id) => `${pcloudRaiz}#/filemanager?folder=${id}`

// Baixa um arquivo do link público pelo caminho (ex.: "aws/apostila.pdf"). O link de download
// do pCloud é temporário, então é pedido na hora; assim a versão mais nova é sempre a baixada.
export async function baixarDoPcloud(caminho) {
  const dados = await fetch(PCLOUD_API).then((r) => r.json())
  if (dados.result !== 0) throw new Error(dados.error)
  let atual = dados.metadata
  for (const nome of caminho.split('/')) {
    atual = atual?.contents?.find((item) => item.name.toLowerCase() === nome.toLowerCase())
  }
  if (!atual?.fileid) throw new Error(`Arquivo não encontrado no pCloud: ${caminho}`)
  // sem o cabeçalho Referer: o pCloud recusa gerar o link quando ele aponta para outro site
  const link = await fetch(
    `https://api.pcloud.com/getpublinkdownload?code=${PCLOUD_CODE}&fileid=${atual.fileid}&forcedownload=1`,
    { referrerPolicy: 'no-referrer' },
  ).then((r) => r.json())
  if (link.result !== 0) throw new Error(link.error)
  // o servidor responde com Content-Disposition: attachment, então a página não é trocada
  window.location.href = `https://${link.hosts[0]}${link.path}`
}
