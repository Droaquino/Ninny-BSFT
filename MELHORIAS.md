# 🗺️ Revisão de Melhorias Visuais & Ferramentas — Ninny BSFT

> Revisão técnica feita após a conclusão das Fases 1–3 (Dashboard, Fichas, Detalhe, Precificação, CMV).
> Prioridades ordenadas por **impacto × esforço**, pensando no usuário final: sócio-dono, baixa familiaridade digital, acessa também pelo celular.

**Esforço:** 🟢 baixo (1–2h) · 🟡 médio (meio dia) · 🔴 alto (1+ dia)
**Impacto:** ⭐ útil · ⭐⭐ importante · ⭐⭐⭐ transformador

---

## 🔍 Diagnóstico do estado atual

### Pontos fracos visuais / UX
- **Sem responsividade mobile** — sidebar fixa (`w-60`) e tabelas estouram em telas pequenas. O dono vai abrir no celular.
- **Feedback de ação fraco** — salvar preço mostra só um ✓ minúsculo inline; falta toast.
- **Loading inconsistente** — Dashboard usa spinner, demais páginas usam skeletons diferentes.
- **`Badge` fora da paleta** — usa `green-100`/`yellow-100` genéricos em vez do verde Ninny `#03a54e`.
- **Logo grande** (112px) empurra a navegação na sidebar.
- **Sem topbar global nem breadcrumbs** — cada página repete o próprio cabeçalho.
- **Sem animações de transição** entre páginas.

### Lacunas de ferramentas / funcionalidades
- **Sem CRUD de fichas pela interface** — toda alteração de receita exige mexer no Supabase manualmente.
- **Sem gestão de insumos** — não há tela central de preços de ingredientes que recalcule os CMVs.
- **Sem exportação** (Excel/PDF) nem impressão de ficha.
- **Sem histórico de preços** — inviabiliza o gráfico de "evolução mensal do CMV".
- **Sem login** — qualquer um com o link edita preços.
- **Sem comparação de tamanhos** (Individual / Médio / Grande) lado a lado.

---

## 🚀 FASE 4 — Quick wins visuais (baixo esforço, alto retorno)

| # | Item | Esforço | Impacto |
|---|------|---------|---------|
| 4.1 | **Responsividade mobile** — menu hambúrguer, sidebar retrátil, tabelas com scroll horizontal ou viram cards | 🟡 | ⭐⭐⭐ |
| 4.2 | **Toasts de feedback** (`sonner`) — "Preço salvo!", "Markup aplicado a 8 pratos" | 🟢 | ⭐⭐ |
| 4.3 | **Loading unificado** — um componente de skeleton/spinner usado em todas as páginas | 🟢 | ⭐ |
| 4.4 | **Empty states amigáveis** — ilustração + mensagem sem jargão ("Nenhum prato por aqui ainda 🍝") | 🟢 | ⭐ |
| 4.5 | **Padronizar paleta** — corrigir `Badge` para o verde Ninny | 🟢 | ⭐ |
| 4.6 | **Logo menor + nome** na sidebar, liberando navegação | 🟢 | ⭐ |
| 4.7 | **Transição suave** entre páginas (fade) | 🟢 | ⭐ |

---

## 🛠️ FASE 5 — Ferramentas de edição (CRUD pela interface)

> Maior alavanca de autonomia: hoje toda alteração de receita exige mexer no Supabase.

| # | Item | Esforço | Impacto |
|---|------|---------|---------|
| 5.1 | **Editar ficha** — nome, categoria, porção, markup direto na tela | 🟡 | ⭐⭐⭐ |
| 5.2 | **Gerenciar ingredientes** — adicionar/remover/editar quantidade, recalcula CMV automático | 🔴 | ⭐⭐⭐ |
| 5.3 | **Tabela de Insumos** — atualizar um insumo recalcula todas as fichas que o usam | 🔴 | ⭐⭐⭐ |
| 5.4 | **Criar nova ficha** do zero | 🟡 | ⭐⭐ |
| 5.5 | **Upload de PDF** direto na ficha (substituir vínculo manual do Drive) | 🟡 | ⭐⭐ |

---

## 📄 FASE 6 — Relatórios e exportação

| # | Item | Esforço | Impacto |
|---|------|---------|---------|
| 6.1 | **Imprimir ficha** — layout `@media print`, uma ficha por folha | 🟢 | ⭐⭐ |
| 6.2 | **Exportar Precificação para Excel** | 🟡 | ⭐⭐ |
| 6.3 | **Relatório PDF do cardápio** — visão executiva | 🟡 | ⭐ |
| 6.4 | **Comparar tamanhos I/M/G** lado a lado | 🟡 | ⭐⭐ |

---

## 📈 FASE 7 — Inteligência e análise

| # | Item | Esforço | Impacto |
|---|------|---------|---------|
| 7.1 | **Histórico de preços** — tabela `price_history` no Supabase | 🟡 | ⭐⭐ |
| 7.2 | **Evolução mensal do CMV** — gráfico de linha (depende de 7.1) | 🟡 | ⭐⭐ |
| 7.3 | **Simulador de impacto no lucro** — "subir R$2 neste prato = quanto no mês?" (usa volume de vendas) | 🔴 | ⭐⭐⭐ |
| 7.4 | **Alertas inteligentes** — pratos cujo CMV subiu por aumento de insumo | 🟡 | ⭐⭐ |
| 7.5 | **Ponto de equilíbrio / contribuição** por prato | 🔴 | ⭐ |

---

## 🔐 FASE 8 — Segurança e robustez

| # | Item | Esforço | Impacto |
|---|------|---------|---------|
| 8.1 | **Login** (Supabase Auth) — proteger edição | 🟡 | ⭐⭐⭐ |
| 8.2 | **Níveis de acesso** — dono edita, equipe visualiza | 🟡 | ⭐⭐ |
| 8.3 | **Confirmação antes de ação em lote** — evitar markup por engano | 🟢 | ⭐⭐ |
| 8.4 | **RLS no Supabase** | 🟡 | ⭐⭐ |
| 8.5 | **Busca global (Ctrl+K)** | 🟡 | ⭐ |

---

## 🎯 Sequência recomendada

1. **Fase 4** — mobile + toasts dão sensação imediata de app profissional, esforço baixo.
2. **Fase 5.3 (Insumos)** — maior valor: muda um preço de insumo, o sistema inteiro se atualiza.
3. **Fase 8.1 (Login)** — antes de expor mais a edição.
4. Demais conforme prioridade do negócio.

---

_Revisão: 2026-06-16_
