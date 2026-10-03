-- Esquema do banco (Neon / PostgreSQL). Idempotente: é aplicado a cada inicialização da API.
-- Tudo o que pertence a um usuário é apagado junto com ele (on delete cascade): excluir a conta
-- elimina progresso, matrículas, reações e dúvidas, como pede o art. 18 da LGPD.

create table if not exists usuarios (
  id bigint generated always as identity primary key,
  google_sub text not null unique,          -- identificador estável da conta Google
  email text not null,
  nome text not null,                       -- nome vindo do Google
  nome_exibicao text,                       -- nome escolhido pela pessoa (opcional)
  foto text,
  consentimento_versao text not null,       -- versão da Política de Privacidade aceita
  consentimento_em timestamptz not null,
  versao_sessao int not null default 1,     -- incrementada para encerrar todas as sessões
  criado_em timestamptz not null default now(),
  ultimo_acesso timestamptz not null default now()
);

-- Progresso nos codelabs: passo mais adiantado e último passo aberto
create table if not exists progresso (
  usuario_id bigint not null references usuarios on delete cascade,
  codelab text not null,
  passo_max int not null check (passo_max between 1 and 200),
  passo_atual int not null check (passo_atual between 1 and 200),
  quando timestamptz not null,
  primary key (usuario_id, codelab)
);

-- Turmas do professor; alunos entram com o código
create table if not exists turmas (
  id bigint generated always as identity primary key,
  professor_id bigint not null references usuarios on delete cascade,
  nome text not null check (length(nome) between 1 and 120),
  codigo text not null unique,
  trilha text,
  criada_em timestamptz not null default now()
);

create table if not exists matriculas (
  turma_id bigint not null references turmas on delete cascade,
  usuario_id bigint not null references usuarios on delete cascade,
  consentimento_em timestamptz not null,    -- aceite de compartilhar o progresso com o professor
  entrou_em timestamptz not null default now(),
  primary key (turma_id, usuario_id)
);

-- "Este passo me ajudou"
create table if not exists uteis (
  usuario_id bigint not null references usuarios on delete cascade,
  codelab text not null,
  passo int not null,
  criado_em timestamptz not null default now(),
  primary key (usuario_id, codelab, passo)
);
create index if not exists uteis_passo on uteis (codelab, passo);

-- Dúvidas por passo, com resposta do professor
create table if not exists duvidas (
  id bigint generated always as identity primary key,
  usuario_id bigint not null references usuarios on delete cascade,
  codelab text not null,
  passo int not null,
  texto text not null check (length(texto) between 1 and 2000),
  resposta text check (resposta is null or length(resposta) between 1 and 4000),
  respondida_em timestamptz,
  criada_em timestamptz not null default now()
);
create index if not exists duvidas_passo on duvidas (codelab, passo);
create index if not exists duvidas_sem_resposta on duvidas (criada_em) where resposta is null;
