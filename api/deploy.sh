#!/bin/sh
# Publica a API no Cloud Run (região São Paulo), a partir do código desta pasta.
# Os segredos (DATABASE_URL, SESSION_SECRET) ficam no Secret Manager; o ID do cliente OAuth
# e a lista de professores vão como variáveis de ambiente.
#
#   PROJETO=meu-projeto GOOGLE_CLIENT_ID=... PROFESSORES=email@exemplo.com ./deploy.sh
set -e
cd "$(dirname "$0")"

: "${PROJETO:?defina PROJETO (ID do projeto no Google Cloud)}"
: "${GOOGLE_CLIENT_ID:?defina GOOGLE_CLIENT_ID}"
: "${PROFESSORES:?defina PROFESSORES (e-mails separados por vírgula)}"
REGIAO="${REGIAO:-southamerica-east1}"
SERVICO="${SERVICO:-bossini-api}"
ORIGENS="${ORIGENS:-https://professorbossini.dev,http://localhost:5173}"

gcloud run deploy "$SERVICO" \
  --project "$PROJETO" \
  --region "$REGIAO" \
  --source . \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 3 \
  --memory 512Mi \
  --cpu 1 \
  --concurrency 80 \
  --timeout 30 \
  --set-secrets "DATABASE_URL=database-url:latest,SESSION_SECRET=session-secret:latest" \
  --set-env-vars "^|^GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID|PROFESSORES=$PROFESSORES|ORIGENS=$ORIGENS" \
  --quiet

gcloud run services describe "$SERVICO" --project "$PROJETO" --region "$REGIAO" --format 'value(status.url)'
