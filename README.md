# Ferramentas Online

Site estático (Eleventy + HTML/CSS/JS puro) com 30 ferramentas gratuitas, construído para GitHub Pages e preparado para solicitar aprovação no Google AdSense.

## Rodando localmente

```
npm install
npm run serve
```

Abre em `http://localhost:8080`.

```
npm run build        # gera o site em _site/
npm run check-links  # verifica links internos quebrados
```

## Antes de publicar — checklist de placeholders

Estes valores estão como placeholder e **precisam ser trocados** antes (ou logo depois) do primeiro deploy:

| Onde | O quê | Arquivo |
|---|---|---|
| URL do site | `SEU-USUARIO.github.io` → seu domínio real | `src/_data/site.js`, `src/static/robots.txt` |
| E-mail de contato | `contato@seudominio.com` | `src/_data/site.js` |
| Link do repositório | `github.com/SEU-USUARIO/...` | `src/_data/site.js` |
| ID do Google Analytics | `G-XXXXXXXXXX` | `src/js/consent.js` |
| ID do AdSense (`ca-pub-...`) | após aprovação | `src/_data/site.js` (`adsenseClient`) e `src/static/ads.txt` |

## Como funciona o AdSense neste projeto

- Os anúncios ficam **desligados** por padrão (`adsenseEnabled: false` em `src/_data/site.js`). O site funciona 100% normalmente sem anúncios — é assim que ele deve estar durante a solicitação de aprovação.
- Depois de aprovado: troque `adsenseClient` pelo seu `ca-pub-XXXXXXXXXXXXXXXX` real, atualize `src/static/ads.txt`, e mude `adsenseEnabled` para `true`.
- O script do AdSense (e do Google Analytics) só carrega depois que o visitante aceita cookies no banner, e mesmo assim só após 3,5s ou a primeira interação — ver `src/js/consent.js`.

## Adicionando uma nova ferramenta

1. Crie um arquivo em `src/ferramentas/nome-da-ferramenta.njk`.
2. Copie o front matter de uma ferramenta existente (layout, title, navTitle, cardText, description, category, permalink).
3. A categoria (`category`) precisa bater com um `slug` de `src/_data/categorias.js`.
4. Rode `npm run build` e `npm run check-links` antes de publicar.

## Deploy

O workflow em `.github/workflows/deploy.yml` builda e publica automaticamente no GitHub Pages a cada push na branch `main`. No repositório do GitHub, em **Settings → Pages**, configure a fonte como "GitHub Actions".

## Páginas institucionais

Já incluídas (obrigatórias para aprovação no AdSense): `/sobre/`, `/contato/`, `/privacidade/`, `/termos/`, `/aviso-legal/`, além de `robots.txt`, `sitemap.xml` e uma página 404 customizada.
