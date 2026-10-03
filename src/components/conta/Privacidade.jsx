import { Box, Card, Link, Stack, Typography } from '@mui/material'
import { VERSAO_POLITICA } from '../../conta/config'
import Reveal from '../Reveal'
import SectionTitle from '../SectionTitle'

const DATA_POLITICA = '2 de outubro de 2026'

function Secao({ titulo, children }) {
  return (
    <Box component="section" sx={{ '& p, & li': { color: 'text.secondary' }, '& ul': { pl: 3, my: 1 }, '& li': { mb: 0.75 }, '& b': { color: 'text.primary' } }}>
      <Typography variant="h6" component="h2" sx={{ mb: 1 }}>{titulo}</Typography>
      {children}
    </Box>
  )
}

const P = (props) => <Typography component="p" sx={{ mb: 1.25 }} {...props} />

// Política de Privacidade (LGPD, Lei n.º 13.709/2018)
export default function Privacidade() {
  return (
    <Box component="article">
      <Reveal>
        <SectionTitle eyebrow="// lgpd">Política de Privacidade</SectionTitle>
        <Typography color="text.secondary" sx={{ mt: -2, mb: 4 }}>
          Última atualização: {DATA_POLITICA} (versão {VERSAO_POLITICA}).
        </Typography>
      </Reveal>

      <Reveal>
        <Card sx={{ p: { xs: 2.5, sm: 3 }, mb: 4 }}>
          <Typography variant="h6" component="p" sx={{ mb: 1 }}>Em resumo</Typography>
          <Box component="ul" sx={{ m: 0, pl: 3, color: 'text.secondary', '& li': { mb: 0.75 } }}>
            <li>Todo o conteúdo do site é aberto. A conta é <b>opcional</b>.</li>
            <li>Sem conta, nenhum dado pessoal seu é guardado: o progresso nos codelabs fica só no seu navegador.</li>
            <li>Com conta, guardamos seu nome, e-mail e foto do Google, seu progresso, suas turmas, dúvidas e passos marcados como úteis.</li>
            <li>Não vendemos nem compartilhamos seus dados para publicidade. Não usamos cookies de rastreamento.</li>
            <li>Você pode baixar ou apagar tudo a qualquer momento em <Link href="/conta/">Minha conta</Link>.</li>
          </Box>
        </Card>
      </Reveal>

      <Stack spacing={4}>
        <Secao titulo="1. Quem é o responsável">
          <P>
            O controlador dos dados é <b>Rodrigo Bossini Tavares Moreira</b>, professor, responsável pelo site
            professorbossini.dev. Pedidos sobre seus dados podem ser feitos pelos canais da seção 9.
          </P>
        </Secao>

        <Secao titulo="2. Quais dados tratamos">
          <P><b>Sem conta</b> (qualquer visitante):</P>
          <ul>
            <li>O progresso nos codelabs (passo atual, passo mais adiantado e data do último acesso) fica guardado apenas no seu navegador (localStorage) e não é enviado a ninguém.</li>
            <li>Estatísticas de visitas pelo GoatCounter, que não usa cookies e não identifica pessoas: contamos páginas vistas, sem guardar endereço IP nem criar perfis.</li>
            <li>Registros técnicos de acesso à API (endereço IP, data, hora e página), feitos automaticamente pela hospedagem, para segurança.</li>
          </ul>
          <P><b>Com conta</b>, além do acima:</P>
          <ul>
            <li><b>Identificação:</b> nome, e-mail, foto e o identificador da sua conta Google. O nome exibido pode ser trocado por você.</li>
            <li><b>Progresso:</b> em cada codelab, o passo mais adiantado, o último passo aberto e quando.</li>
            <li><b>Turmas:</b> as turmas em que você entrar e quando entrou.</li>
            <li><b>Interação:</b> as dúvidas que você escrever, as respostas recebidas e os passos que marcar como úteis.</li>
            <li><b>Registro do aceite:</b> a versão desta política que você aceitou e quando.</li>
          </ul>
          <P>Não pedimos CPF, telefone, endereço nem dados sensíveis.</P>
        </Secao>

        <Secao titulo="3. Para que usamos">
          <ul>
            <li>Manter seu progresso nos codelabs em qualquer dispositivo.</li>
            <li>Permitir que você participe das turmas do professor e que ele acompanhe o progresso da turma.</li>
            <li>Mostrar e responder dúvidas em cada passo e indicar quais passos ajudaram mais.</li>
            <li>Proteger o site contra abuso (por exemplo, limitar o envio de mensagens em sequência).</li>
          </ul>
        </Secao>

        <Secao titulo="4. Bases legais">
          <ul>
            <li><b>Consentimento</b> (art. 7º, I, da LGPD): para criar a conta e tratar os dados descritos acima. Ele é pedido na criação da conta e de novo sempre que esta política mudar.</li>
            <li><b>Consentimento específico</b> para cada turma: ao entrar numa turma, você autoriza que o professor dela veja seu nome, e-mail e progresso nos codelabs.</li>
            <li><b>Legítimo interesse</b> (art. 7º, IX): para os registros técnicos de acesso, usados só para segurança e diagnóstico de falhas.</li>
          </ul>
          <P>Você pode revogar o consentimento a qualquer momento, saindo de uma turma ou excluindo a conta.</P>
        </Secao>

        <Secao titulo="5. Quem vê seus dados">
          <ul>
            <li><b>Outros visitantes</b> veem, nas dúvidas públicas, apenas seu primeiro nome e a inicial do sobrenome (por exemplo, "Ana S."), o texto da dúvida e a resposta. Seu e-mail e sua foto nunca aparecem para eles. O total de "útil" de cada passo é exibido sem identificar quem marcou.</li>
            <li><b>O professor de uma turma</b> em que você entrou vê seu nome, e-mail e progresso nos codelabs. Ele também pode responder ou remover dúvidas.</li>
            <li><b>Operadores</b> que processam os dados para o site funcionar:
              <ul>
                <li>Google Cloud (Cloud Run), que hospeda a API, na região de São Paulo (Brasil).</li>
                <li>Neon, que hospeda o banco de dados PostgreSQL na AWS, região de São Paulo (Brasil).</li>
                <li>Google, que autentica o login com a sua conta Google, conforme a política de privacidade do próprio Google. O script de login do Google só é carregado quando você abre a janela de entrar.</li>
                <li>GitHub Pages, que hospeda as páginas do site, e GoatCounter, que conta visitas sem identificar pessoas.</li>
              </ul>
            </li>
          </ul>
          <P>Não vendemos, alugamos nem cedemos seus dados a terceiros.</P>
        </Secao>

        <Secao titulo="6. Onde e por quanto tempo guardamos">
          <ul>
            <li>Os dados da conta ficam no Brasil (São Paulo) enquanto a conta existir.</li>
            <li>Contas sem acesso há <b>24 meses</b> são excluídas automaticamente, com tudo o que pertence a elas.</li>
            <li>Ao excluir a conta, todos os dados são apagados na hora: progresso, turmas, dúvidas e marcações.</li>
            <li>Ao sair de uma turma, o professor deixa de ver seus dados. Se ele apagar a turma, as matrículas são apagadas junto.</li>
            <li>Registros técnicos de acesso ficam na hospedagem por até 30 dias.</li>
            <li>Ao sair da conta num navegador, o progresso guardado nele é apagado (ele continua salvo na conta).</li>
          </ul>
        </Secao>

        <Secao titulo="7. Seus direitos (art. 18 da LGPD)">
          <P>Em <Link href="/conta/">Minha conta</Link>, sem precisar pedir a ninguém, você pode:</P>
          <ul>
            <li><b>Confirmar e acessar</b> os dados guardados, e <b>levá-los</b> com você: o botão "Baixar meus dados" gera um arquivo JSON com tudo.</li>
            <li><b>Corrigir</b> o nome exibido. Nome, e-mail e foto acompanham a conta Google e são atualizados a cada entrada.</li>
            <li><b>Revogar o consentimento</b> de uma turma, saindo dela.</li>
            <li><b>Eliminar</b> todos os dados, excluindo a conta.</li>
            <li><b>Encerrar a sessão em todos os dispositivos</b>.</li>
          </ul>
          <P>
            Você também pode pedir informações sobre o tratamento, se opor a ele ou reclamar à Autoridade
            Nacional de Proteção de Dados (<Link href="https://www.gov.br/anpd" target="_blank" rel="noopener">ANPD</Link>).
          </P>
        </Secao>

        <Secao titulo="8. Segurança">
          <ul>
            <li>Toda a comunicação usa HTTPS. O banco exige conexão criptografada.</li>
            <li>O site não guarda senhas: o login é feito pelo Google, e a API confere a assinatura do Google em cada entrada.</li>
            <li>A sessão é um token assinado, guardado no seu navegador, válido por 30 dias, que pode ser encerrado em todos os dispositivos.</li>
            <li>Os segredos da aplicação ficam no Secret Manager do Google Cloud, fora do código.</li>
            <li>A API só aceita chamadas vindas do próprio site.</li>
          </ul>
        </Secao>

        <Secao titulo="9. Contato">
          <P>
            Para dúvidas ou pedidos sobre seus dados, fale com o responsável pelos canais listados em{' '}
            <Link href="/redes/">Redes sociais</Link> (mensagem direta no Instagram @professorbossini ou no LinkedIn).
            Os pedidos de acesso, cópia e exclusão podem ser feitos na hora em <Link href="/conta/">Minha conta</Link>.
          </P>
        </Secao>

        <Secao titulo="10. Crianças e adolescentes">
          <P>
            O site é voltado a estudantes de cursos técnicos e superiores. Menores de 18 anos devem criar conta
            com o conhecimento dos responsáveis, e crianças com menos de 12 anos não devem criar conta.
          </P>
        </Secao>

        <Secao titulo="11. Mudanças nesta política">
          <P>
            Se esta política mudar, a data e a versão no topo da página são atualizadas e, na próxima vez que você
            entrar, o site pede que você leia e aceite a nova versão para continuar usando a conta.
          </P>
        </Secao>
      </Stack>
    </Box>
  )
}
