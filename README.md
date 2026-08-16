# InvenTag — SaaS de inventário e rastreamento RFID

Plataforma web para controle de ativos e inventário com leitura RFID: cadastro de produtos e
ativos, localizações, leituras (scans), tratamento de divergências entre o esperado e o lido,
manutenção e relatórios. Inclui painel dedicado para o operador de campo e landing page comercial.

**Stack:** React 18 · TypeScript · Vite · Tailwind CSS · React Router · Supabase (Auth + Postgres + RLS)

> Projeto desenvolvido em dupla com [@gabrieldagostivana](https://github.com/gabrieldagostivana).
> Repositório original: <https://github.com/gabrieldagostivana/InvenTag>

---

## Funcionalidades

| Módulo | O que faz |
|---|---|
| **Inventário** | CRUD de produtos, detalhe e listagem |
| **Ativos** | Cadastro e ficha de ativos rastreados por tag RFID |
| **Localizações** | Cadastro de locais e o que está alocado em cada um |
| **Leituras (scans)** | Registro de leitura RFID, histórico e detalhe por leitura |
| **Divergências** | Comparação entre esperado e lido, com fluxo de tratamento |
| **Manutenção** | Controle de itens em manutenção |
| **Relatórios** | Consolidação por período e por localização |
| **Operador** | Painel simplificado para uso em campo |

## Autenticação e permissões

- Login e recuperação de senha via **Supabase Auth**
- Rotas protegidas por `ProtectedRoute`, com perfil de acesso por usuário
- **RLS no Postgres** — a autorização vive no banco, não só no cliente
- Tela de `Unauthorized` para acesso negado

## Acessibilidade e temas

Contexto de tema com modo **claro, escuro e "idoso"** (tipografia e contraste ampliados),
pensado para uso em chão de fábrica e almoxarifado.

## Rodando local

```bash
cp .env.example .env      # preencha com URL e chave anon do Supabase
npm install
npm run dev
```

Sem as variáveis de ambiente a aplicação sobe em **modo demo**, usando dados locais —
útil para avaliar a interface sem provisionar um projeto Supabase.

As migrações ficam em `supabase/migrations/` e criam as tabelas principais, os perfis de
usuário e as políticas de RLS.

## Estrutura

```
src/
├─ pages/
│  ├─ inventory/     divergences/    locations/
│  ├─ assets/        scans/          maintenance/
│  ├─ auth/          operator/
│  └─ Dashboard, Reports, Settings, Landing, Pricing
├─ components/       Layout, ProtectedRoute, StatusBadge
├─ lib/              supabase, auth-context, theme-context, data
└─ types/
```
