# Leicester Employment Agencies Map

Aplicacao web para localizar agencias de recrutamento em Leicester, visualizar detalhes de contato, explorar as localizacoes no mapa e manter o projeto funcional mesmo quando o banco estiver indisponivel.

## Stack atual

- Frontend: React 19 + Vite
- Backend: Express + tRPC
- ORM: Drizzle ORM
- Banco: PostgreSQL
- Mapas: Mapbox GL JS
- Estado de dados: React Query

## Funcionalidades implementadas

- Listagem de agencias com busca por nome/endereco
- Filtro por regiao
- Pagina de detalhes da agencia
- Mapa com marcadores e ajuste automatico de bounds
- Mapa detalhado com geolocalizacao, rota e alternancia 2D/3D
- Dados de fallback locais quando o banco falha ou esta vazio
- Banner visual informando quando o fallback esta ativo
- Horarios de funcionamento exibidos na tela de detalhe
- Reviews locais por agencia usando `localStorage`
- Formulario de contato com validacao e preparo de inquiry via backend
- Notificacao do owner quando o servico de notificacao estiver configurado

## Variaveis de ambiente

Crie um arquivo `.env` na raiz com:

```env
VITE_MAPBOX_ACCESS_TOKEN=pk.your_public_mapbox_token
VITE_MAPBOX_STYLE_URL=mapbox://styles/mapbox/streets-v12
DATABASE_URL=postgresql://postgres:<PASSWORD>@<HOST>:5432/postgres
VITE_OAUTH_PORTAL_URL=https://example.com
VITE_APP_ID=your-app-id
BUILT_IN_FORGE_API_URL=
BUILT_IN_FORGE_API_KEY=
```

Observacoes:

- `DATABASE_URL` deve estar URL-encoded quando a senha tiver caracteres especiais.
- `BUILT_IN_FORGE_API_URL` e `BUILT_IN_FORGE_API_KEY` sao opcionais. Quando ausentes, o envio de inquiry continua abrindo o email do usuario, mas sem notificar o owner.

## Comandos

```bash
npm install
npm run dev
npm run check
npm run test
npm run build
```

## Fluxo de dados

1. A home consulta `agencies.list` via tRPC.
2. O backend tenta ler do PostgreSQL.
3. Se o banco estiver indisponivel ou a tabela `agencies` estiver vazia, o backend entrega `shared/agencySeedData.ts`.
4. O frontend mostra um alerta de fallback e segue funcionando normalmente.

## Estrutura principal

- `client/src/pages/Home.tsx`: home, busca, filtro, banner de fallback
- `client/src/pages/AgencyDetail.tsx`: detalhes, horarios, reviews, contato
- `client/src/components/MapboxMap.tsx`: mapa detalhado da agencia
- `client/src/components/MapboxMapWithMarkers.tsx`: mapa geral com marcadores
- `server/routers.ts`: rotas tRPC de agencias e inquiries
- `server/db.ts`: conexao com PostgreSQL
- `shared/agencySeedData.ts`: dataset local de contingencia

## Estado atual

O projeto esta preparado para funcionar em dois cenarios:

- Com banco populado: usa os dados do PostgreSQL.
- Sem banco ou com tabela vazia: usa o fallback local e informa isso na interface.
