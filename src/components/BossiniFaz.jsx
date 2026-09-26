import { Box, Button, Card, Chip, Grid, Link, Stack, Typography } from '@mui/material'
import ArrowOutward from '@mui/icons-material/ArrowOutward'
import ArticleOutlined from '@mui/icons-material/ArticleOutlined'
import AppsOutlined from '@mui/icons-material/AppsOutlined'
import BusinessCenterOutlined from '@mui/icons-material/BusinessCenterOutlined'
import CodeOutlined from '@mui/icons-material/CodeOutlined'
import EmojiEventsOutlined from '@mui/icons-material/EmojiEventsOutlined'
import FactCheckOutlined from '@mui/icons-material/FactCheckOutlined'
import GavelOutlined from '@mui/icons-material/GavelOutlined'
import GroupsOutlined from '@mui/icons-material/GroupsOutlined'
import HandshakeOutlined from '@mui/icons-material/HandshakeOutlined'
import HistoryEduOutlined from '@mui/icons-material/HistoryEduOutlined'
import LightbulbOutlined from '@mui/icons-material/LightbulbOutlined'
import MilitaryTechOutlined from '@mui/icons-material/MilitaryTechOutlined'
import SchoolOutlined from '@mui/icons-material/SchoolOutlined'
import SportsScoreOutlined from '@mui/icons-material/SportsScoreOutlined'
import Telegram from '@mui/icons-material/Telegram'
import TerminalOutlined from '@mui/icons-material/TerminalOutlined'
import VolunteerActivismOutlined from '@mui/icons-material/VolunteerActivismOutlined'
import logoPython from 'devicon/icons/python/python-original.svg'
import {
  avaliacaoNacional,
  cursosMinistrados,
  eventosOrganizados,
  extensao,
  gestaoAcademica,
  jaLecionei,
  lattes,
  mercado,
  numeros,
  ondeLeciono,
  orientacoesDestaque,
  publicacoes,
  reconhecimentos,
  resumoOrientacoes,
  softwares,
  tecnicoDeEquipes,
} from '../bossiniFaz'
import { gradienteTexto, monoFontFamily } from '../theme'
import GlowCard from './GlowCard'
import { Logo, Painel } from './Painel'
import Reveal from './Reveal'
import SectionTitle from './SectionTitle'

const tiposDeEvento = {
  maratona: { rotulo: 'Maratona', icone: SportsScoreOutlined },
  hackathon: { rotulo: 'Hackathon', icone: LightbulbOutlined },
  concurso: { rotulo: 'Concurso', icone: EmojiEventsOutlined },
  evento: { rotulo: 'Evento', icone: GroupsOutlined },
}

// ícones dos itens de extensão e software
const icones = {
  telegram: { Icone: Telegram, fundo: '#26A5E4', cor: '#fff' },
  codigo: { Icone: CodeOutlined },
  terminal: { Icone: TerminalOutlined },
  grupo: { Icone: GroupsOutlined },
  banca: { Icone: GavelOutlined },
}

function IconeQuadrado({ icone: Icone, fundo, cor }) {
  return (
    <Box
      aria-hidden
      sx={{
        flexShrink: 0,
        width: 40,
        height: 40,
        borderRadius: '10px',
        display: 'grid',
        placeItems: 'center',
        bgcolor: fundo ?? 'primary.container',
        color: cor ?? 'primary.onContainer',
      }}
    >
      <Icone sx={{ fontSize: 22 }} />
    </Box>
  )
}

// Visual à esquerda de um item: logo, ícone de marca ou ícone genérico
function Visual({ logo, icone, alt, padrao }) {
  if (icone === 'python') return <Logo src={logoPython} alt="" largura={40} altura={40} />
  if (logo) return <Logo src={logo} alt={alt} largura={64} altura={40} />
  const { Icone, fundo, cor } = icones[icone] ?? { Icone: padrao }
  return <IconeQuadrado icone={Icone} fundo={fundo} cor={cor} />
}

function LinkExterno({ href, children }) {
  if (!href) return children
  return (
    <Link href={href} target="_blank" rel="noopener" color="inherit" underline="hover" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}>
      {children}
      <ArrowOutward sx={{ fontSize: 14, color: 'text.secondary' }} />
    </Link>
  )
}

function Ano({ children }) {
  return (
    <Typography sx={{ fontFamily: monoFontFamily, fontSize: 13, color: 'primary.main', flexShrink: 0, whiteSpace: 'nowrap' }}>
      {children}
    </Typography>
  )
}

// Linha de uma lista: visual, título (com link opcional), texto de apoio e ano à direita
function Item({ titulo, texto, ano, href, logo, icone, padrao }) {
  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
      <Visual logo={logo} icone={icone} alt={titulo} padrao={padrao} />
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          <LinkExterno href={href}>{titulo}</LinkExterno>
        </Typography>
        {texto && (
          <Typography variant="caption" color="text.secondary" component="p">
            {texto}
          </Typography>
        )}
      </Box>
      {ano && <Ano>{ano}</Ano>}
    </Stack>
  )
}

function Bloco({ icone: Icone, titulo, children, delay }) {
  return (
    <Box component="section" sx={{ mt: 6 }}>
      <Reveal delay={delay}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', mb: 2.5 }}>
          <Icone sx={{ color: 'primary.main' }} />
          <Typography variant="h5" component="h2">{titulo}</Typography>
        </Stack>
      </Reveal>
      {children}
    </Box>
  )
}

function Numeros() {
  return (
    <Grid container spacing={2}>
      {numeros.map(({ valor, rotulo, detalhe }, i) => (
        <Grid key={rotulo} size={{ xs: 6, md: 3 }}>
          <Reveal delay={i * 60} sx={{ height: '100%' }}>
            <Card sx={{ height: '100%', p: { xs: 2, sm: 2.5 } }}>
              <Typography
                sx={{
                  fontSize: { xs: '2.25rem', sm: '2.75rem' },
                  fontWeight: 700,
                  lineHeight: 1.1,
                  background: gradienteTexto,
                  backgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {valor}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>{rotulo}</Typography>
              {detalhe && (
                <Typography variant="caption" color="text.secondary">{detalhe}</Typography>
              )}
            </Card>
          </Reveal>
        </Grid>
      ))}
    </Grid>
  )
}

function OndeLeciono() {
  return (
    <>
      <Grid container spacing={2}>
        {ondeLeciono.map(({ nome, logo, href, desde, cursos, disciplinas }, i) => (
          <Grid key={nome} size={{ xs: 12, md: 4 }}>
            <Reveal delay={i * 80} sx={{ height: '100%' }}>
              <GlowCard href={href}>
                <Stack spacing={1.5} sx={{ width: '100%' }}>
                  <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    <Logo src={logo} alt={nome} largura={132} altura={56} />
                    <ArrowOutward sx={{ color: 'text.secondary', fontSize: 20 }} />
                  </Stack>
                  <Box>
                    <Typography variant="h6" component="h3" sx={{ fontSize: '1.05rem' }}>{nome}</Typography>
                    <Typography sx={{ fontFamily: monoFontFamily, fontSize: 13, color: 'primary.main' }}>desde {desde}</Typography>
                  </Box>
                  <Typography variant="body2">{cursos}</Typography>
                  <Typography variant="caption" color="text.secondary">{disciplinas}</Typography>
                </Stack>
              </GlowCard>
            </Reveal>
          </Grid>
        ))}
      </Grid>
      <Reveal delay={120}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1.5, sm: 3 }} useFlexGap sx={{ mt: 2.5, flexWrap: 'wrap', alignItems: { sm: 'center' } }}>
          <Typography variant="body2" color="text.secondary">Já lecionei em</Typography>
          {jaLecionei.map(({ nome, periodo, logo, href }) => (
            <Stack key={nome} direction="row" spacing={1.25} sx={{ alignItems: 'center' }}>
              <Logo src={logo} alt={nome} largura={64} altura={36} />
              <Box>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  <LinkExterno href={href}>{nome}</LinkExterno>
                </Typography>
                <Typography variant="caption" color="text.secondary">{periodo}</Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Reveal>
    </>
  )
}

function ChipEvento({ nome, tipo, href }) {
  const { rotulo, icone: Icone } = tiposDeEvento[tipo]
  return (
    <Chip
      icon={<Icone />}
      label={nome}
      title={rotulo}
      variant="soft"
      color={tipo === 'hackathon' ? 'secondary' : 'primary'}
      {...(href ? { component: 'a', href, target: '_blank', rel: 'noopener', clickable: true } : {})}
      sx={{ height: 'auto', py: 0.5, '& .MuiChip-label': { whiteSpace: 'normal' } }}
    />
  )
}

function Eventos() {
  return (
    <Reveal>
      <Card sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack direction="row" spacing={2} useFlexGap sx={{ flexWrap: 'wrap', mb: 3 }}>
          {Object.entries(tiposDeEvento).map(([tipo, { rotulo, icone: Icone }]) => (
            <Stack key={tipo} direction="row" spacing={0.75} sx={{ alignItems: 'center', color: 'text.secondary' }}>
              <Icone sx={{ fontSize: 18 }} />
              <Typography variant="caption">{rotulo}</Typography>
            </Stack>
          ))}
        </Stack>
        <Stack spacing={2.5}>
          {eventosOrganizados.map(({ ano, eventos }) => (
            <Stack key={ano} direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }}>
              <Typography sx={{ fontFamily: monoFontFamily, fontWeight: 600, color: 'primary.main', width: 48, flexShrink: 0, pt: 0.5 }}>
                {ano}
              </Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {eventos.map((e) => (
                  <ChipEvento key={e.nome} {...e} />
                ))}
              </Stack>
            </Stack>
          ))}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 1, sm: 3 }}>
            <Typography sx={{ fontFamily: monoFontFamily, fontWeight: 600, color: 'primary.main', width: 48, flexShrink: 0, pt: 0.5 }}>
              2014
            </Typography>
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>Técnico de equipes</Typography>
              <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
                {tecnicoDeEquipes.map(({ nome, href }) => (
                  <ChipEvento key={nome} nome={nome} tipo="maratona" href={href} />
                ))}
              </Stack>
            </Box>
          </Stack>
        </Stack>
      </Card>
    </Reveal>
  )
}

function Orientacoes() {
  return (
    <>
      <Reveal>
        <Typography color="text.secondary" sx={{ mb: 2.5, maxWidth: 680 }}>
          {resumoOrientacoes} Alguns destaques:
        </Typography>
      </Reveal>
      <Grid container spacing={2}>
        {orientacoesDestaque.map(({ titulo, ano, local, tema }, i) => (
          <Grid key={titulo} size={{ xs: 12, sm: 6, md: 3 }}>
            <Reveal delay={(i % 4) * 60} sx={{ height: '100%' }}>
              <Card sx={{ height: '100%', p: 2.5, display: 'flex', flexDirection: 'column', gap: 1.25 }}>
                <Chip label={tema} size="small" variant="soft" color="primary" sx={{ alignSelf: 'flex-start' }} />
                <Typography variant="body2" sx={{ fontWeight: 500, flex: 1 }}>{titulo}</Typography>
                <Typography sx={{ fontFamily: monoFontFamily, fontSize: 12, color: 'text.secondary' }}>
                  {ano} · {local}
                </Typography>
              </Card>
            </Reveal>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default function BossiniFaz() {
  return (
    <Box component="section">
      <Reveal>
        <SectionTitle eyebrow="// bossini faz">Bossini faz</SectionTitle>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mt: -2, mb: 4, alignItems: { sm: 'center' }, justifyContent: 'space-between' }}>
          <Typography color="text.secondary" sx={{ maxWidth: 620 }}>
            Sala de aula, maratonas de programação, orientação de projetos, avaliação nacional e software.
            Uma seleção do meu Currículo Lattes.
          </Typography>
          <Button href={lattes} target="_blank" rel="noopener" variant="tonal" endIcon={<ArrowOutward />} sx={{ flexShrink: 0, alignSelf: { xs: 'flex-start', sm: 'center' } }}>
            Currículo Lattes
          </Button>
        </Stack>
      </Reveal>

      <Numeros />

      <Bloco icone={SchoolOutlined} titulo="Onde leciono">
        <OndeLeciono />
      </Bloco>

      <Grid container spacing={2} sx={{ mt: 6 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Painel icon={FactCheckOutlined} titulo="Avaliação nacional e bancas">
            <Stack spacing={2}>
              {avaliacaoNacional.map((a) => (
                <Item key={a.titulo} titulo={a.titulo} texto={a.texto} href={a.href} logo={a.logo} icone={a.icone} />
              ))}
            </Stack>
          </Painel>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Painel icon={HandshakeOutlined} titulo="Gestão acadêmica" delay={80}>
            <Stack spacing={2}>
              {gestaoAcademica.map((g) => (
                <Item key={g.titulo} titulo={g.titulo} texto={`${g.local} · ${g.periodo}`} href={g.href} padrao={GroupsOutlined} />
              ))}
            </Stack>
          </Painel>
        </Grid>
      </Grid>

      <Bloco icone={EmojiEventsOutlined} titulo="Maratonas, hackathons e concursos que organizei">
        <Eventos />
      </Bloco>

      <Bloco icone={HistoryEduOutlined} titulo="Orientações">
        <Orientacoes />
      </Bloco>

      <Grid container spacing={2} sx={{ mt: 6 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Painel icon={VolunteerActivismOutlined} titulo="Projetos de extensão (2021)">
            <Stack spacing={1.75}>
              {extensao.map((e) => (
                <Item key={e.titulo} titulo={e.titulo} href={e.href} icone={e.icone} />
              ))}
            </Stack>
          </Painel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Painel icon={SchoolOutlined} titulo="Cursos de extensão ministrados" delay={80}>
            <Stack spacing={1.75}>
              {cursosMinistrados.map((c) => (
                <Item key={c.titulo} titulo={c.titulo} texto={c.detalhe} ano={c.ano} padrao={SchoolOutlined} />
              ))}
            </Stack>
          </Painel>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Painel icon={AppsOutlined} titulo="Software que desenvolvi">
            <Stack spacing={1.75}>
              {softwares.map((s) => (
                <Item key={s.nome} titulo={s.nome} texto={s.descricao} ano={s.ano} icone={s.icone} padrao={CodeOutlined} />
              ))}
            </Stack>
          </Painel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Painel icon={ArticleOutlined} titulo="Publicações" delay={80}>
            <Stack spacing={1.75}>
              {publicacoes.map((p) => (
                <Item key={p.titulo} titulo={p.titulo} texto={p.onde} ano={p.ano} href={p.href} padrao={ArticleOutlined} />
              ))}
            </Stack>
          </Painel>
        </Grid>

        <Grid size={12}>
          <Painel icon={BusinessCenterOutlined} titulo="Desenvolvedor no mercado">
            <Grid container spacing={2}>
              {mercado.map((m) => (
                <Grid key={m.empresa} size={{ xs: 12, sm: 6 }}>
                  <Item titulo={m.empresa} texto={m.cargo} ano={m.periodo} padrao={CodeOutlined} />
                </Grid>
              ))}
            </Grid>
          </Painel>
        </Grid>
      </Grid>

      <Bloco icone={MilitaryTechOutlined} titulo="Reconhecimentos">
        <Grid container spacing={2}>
          {reconhecimentos.map((r, i) => (
            <Grid key={`${r.titulo}-${r.ano}`} size={{ xs: 12, sm: 6, md: 4 }}>
              <Reveal delay={(i % 3) * 60} sx={{ height: '100%' }}>
                <Card sx={{ height: '100%', p: 2.5 }}>
                  <Stack spacing={1.5}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
                      {r.logo ? (
                        <Logo src={r.logo} alt="" largura={84} altura={44} />
                      ) : (
                        <IconeQuadrado icone={MilitaryTechOutlined} />
                      )}
                      <Ano>{r.ano}</Ano>
                    </Stack>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{r.titulo}</Typography>
                      <Typography variant="caption" color="text.secondary">{r.texto}</Typography>
                    </Box>
                  </Stack>
                </Card>
              </Reveal>
            </Grid>
          ))}
        </Grid>
      </Bloco>
    </Box>
  )
}
