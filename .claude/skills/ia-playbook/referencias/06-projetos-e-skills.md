# Projetos do Igor e skills recomendadas

Levantamento de 29/09/2026 (GitHub IG1816 + gabrieldagostivana, Vercel, Supabase).

## Base para todos os projetos

| Skill | Por quê |
|---|---|
| [andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | 4 regras contra erros típicos de LLM (não assumir, não esconder dúvida, mostrar trade-off, não complicar) |
| [DietrichGebert/ponytail](https://github.com/DietrichGebert/ponytail) | Menos código = menos tokens e menos bug |
| [obra/superpowers](https://github.com/obra/superpowers) **ou** [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) | Fluxo de engenharia (spec, plano, TDD, revisão). Escolher **um** dos dois; os dois juntos se sobrepõem |

## Por projeto

| Projeto | Stack | Skills a mais |
|---|---|---|
| **Studio Beholder** (site de peças + bastidores + admin) | Vercel + Supabase (`beholder-studios`) | `supabase/agent-skills`, `vercel-labs/agent-skills` (web-design-guidelines), [nexu-io/open-design](https://github.com/nexu-io/open-design), [blader/humanizer](https://github.com/blader/humanizer) para os textos |
| **D&D Pensamentos** → `codice-amaldicoado` | Skill Claude + Python | Já segue o padrão moderno (roteador + referências + scripts). Ver nota abaixo |
| **FM Combeiro** → `fm-combeiro-raw-skill` (arquivado) | Skill do Cursor | Juntar no Códice como referência de otimização RAW; um repositório só |
| `feiticeiros-e-maldicoes` (mesa online, 3D, multiplayer) | JS · Node · WebSocket | [cloudflare/security-audit-skill](https://github.com/cloudflare/security-audit-skill) no servidor WebSocket; [tt-a1i/archify](https://github.com/tt-a1i/archify) para documentar a arquitetura |
| `fornoslot` (SaaS padarias) | Next.js · Supabase · Zod | `supabase/agent-skills`, `vercel-labs/agent-skills` (react-best-practices), `cloudflare/security-audit-skill` (RLS e RPC). O `AGENTS.md` com as regras do Next 16 já está certo |
| `agrolino` + `agrolino-api` | Next.js · FastAPI · Postgres | `vercel-labs/agent-skills`; `addyosmani/agent-skills` (design de API, segurança) no FastAPI |
| `inventag` (RFID) | React · Vite · Supabase | `supabase/agent-skills`, `cloudflare/security-audit-skill` |
| Landing pages (agropecuária, hamburgueria, varejo), cuidajunto, pesquisa-cuidado-familia, quick-find | React/Vite ou Next · Vercel | `vercel-labs/agent-skills` (web-design-guidelines), `nexu-io/open-design`, `blader/humanizer` |
| `leadfinder` (prospecção) | Python · OSM · Google Places | [googleworkspace/cli](https://github.com/googleworkspace/cli) para mandar os leads direto pro Sheets; [every-app/open-seo](https://github.com/every-app/open-seo) para vender SEO junto com o site |
| Plataforma BFD (`frontend`, tech lead) | Next.js | `addyosmani/agent-skills` (fluxo de time: spec, revisão, CI) |
| YouTube / conteúdo | — | `blader/humanizer`; Batch API para processar comentários |

## Nota sobre o Códice Amaldiçoado

Ele já faz o que o Samuel chama de uso avançado: divulgação progressiva (SKILL.md curto + roteador + referências), scripts determinísticos (`simular_duelo.py`) em vez de pedir conta ao modelo, e prompts de agente de pesquisa. Próximo nível:

- Um **eval** com fichas conhecidas e o resultado certo (passa/falha).
- Um **hook** que roda a simulação quando uma build muda.

## Cuidados

- Não instalar tudo: cada skill põe a descrição no contexto.
- Skill de terceiro pode rodar script. Ler o `SKILL.md` antes de instalar.
- Catálogos para explorar: [anthropics/skills](https://github.com/anthropics/skills), [VoltAgent/awesome-agent-skills](https://github.com/VoltAgent/awesome-agent-skills).
