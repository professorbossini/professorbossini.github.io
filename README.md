# Rodrigo Bossini

### Professor Universitário | Desenvolvedor de Software | Eterno Aprendiz

Site pessoal publicado em [professorbossini.dev](https://professorbossini.dev).

## Stack

- [React](https://react.dev) + [Vite](https://vite.dev)
- [MUI (Material UI)](https://mui.com) com tema Material 3 próprio, claro e escuro
- Fontes Google Sans Flex e Google Sans Code

## Rodando localmente

```bash
npm install
npm run dev      # servidor de desenvolvimento em http://localhost:5173
npm run build    # gera o site estático em dist/
npm run preview  # serve o build localmente
```

## Estrutura

- `src/data.js` — textos, links, formação, certificações e fotos (edite aqui o conteúdo)
- `src/theme.js` — paleta, gradiente, tipografia e curvas de movimento
- `src/components/` — seções da página
- `public/` — imagens, favicon e `CNAME`

## Deploy

O push na `main` dispara o workflow `.github/workflows/deploy.yml`, que faz o build e publica
no GitHub Pages. Em **Settings → Pages**, a fonte precisa estar como **GitHub Actions**.
