# Requisitos do Produto

## Visao geral

O produto e uma aplicacao web focada em agencias de recrutamento em Leicester. Ele precisa permitir descoberta rapida, consulta de detalhes, navegacao por mapa e resiliencia quando a fonte principal de dados nao estiver disponivel.

## Objetivos

- Permitir encontrar agencias por nome, endereco e regiao.
- Exibir contato, localizacao, horarios e informacoes complementares.
- Fornecer experiencia consistente em desktop e mobile.
- Continuar util em modo degradado com fallback local.

## Escopo funcional atual

### Home

- Busca textual por nome e endereco
- Filtro por regiao
- Contagem de resultados
- Mapa com todas as agencias
- Aviso visual quando os dados vierem do fallback

### Detalhe da agencia

- Nome, endereco, telefone, email, website e LinkedIn
- Coordenadas e mapa detalhado
- Botao de direcoes
- Lista de recrutadores
- Horarios de funcionamento
- Reviews locais por agencia
- Formulario de contato

### Resiliencia de dados

- Fonte principal: PostgreSQL
- Fonte secundaria: dataset local versionado no repositorio
- Quando o banco falha ou a tabela esta vazia, a API entrega o fallback

## Requisitos tecnicos

- Frontend: React + Vite
- Backend: Express + tRPC
- ORM: Drizzle ORM
- Banco: PostgreSQL
- Mapa: Mapbox GL JS
- Tipagem: TypeScript strict

## Contrato de dados de agencia

Cada agencia deve conter:

- `id`
- `name`
- `address`
- `phone`
- `email`
- `website`
- `linkedIn`
- `latitude`
- `longitude`
- `description`
- `services`
- `documentsRequired`
- `openingHours`
- `region`
- `recruiters`

## Requisitos operacionais

- `DATABASE_URL` precisa ser valida
- `VITE_MAPBOX_ACCESS_TOKEN` precisa estar configurado para o mapa
- O app deve iniciar localmente com `npm run dev`
- `npm run check`, `npm run test` e `npm run build` devem ser usados como validacao final

## Pendencias futuras fora do escopo atual

- Persistencia de reviews no backend
- Painel administrativo para gerir agencias
- Ingestao automatizada de dados externos
- Favoritos e autenticacao expandida
