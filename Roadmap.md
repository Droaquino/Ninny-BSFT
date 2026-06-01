# Roadmap — Ninny BSFT

## Visão de Produto

Um painel interno para o gestor do Ninny consultar fichas técnicas, entender a precificação e acompanhar o CMV — construído em fases progressivas, começando pelo problema mais urgente: **acesso visual às fichas técnicas**.

---

## Fase 1 — MVP: Fichas Técnicas

> **Objetivo:** O gestor consegue encontrar qualquer ficha técnica em segundos, ver os ingredientes e custos de forma visual, e abrir/baixar o PDF original.

### Escopo do MVP

#### Módulo: Catálogo de Fichas Técnicas
- [ ] Listagem de todas as fichas por categoria (Entradas, Sughi, Sughi Special, Sughi Al Mare, Pratos Compostos, Pratos Duplos, Risoto, Sobremesa, Bebidas)
- [ ] Busca por nome do prato
- [ ] Filtro por categoria
- [ ] Card visual por prato com: nome, categoria, CMV total (R$) e CMV% do preço de venda
- [ ] Página de detalhe da ficha com tabela de ingredientes (nome | peso | custo unitário | custo total)
- [ ] Botão para abrir/baixar o PDF original da ficha
- [ ] Indicador visual de saúde do CMV (verde/amarelo/vermelho conforme a faixa: <30% / 30–38% / >38%)

#### Infraestrutura
- [ ] Setup do projeto (React + Vite + TypeScript + Tailwind + shadcn/ui)
- [ ] Configuração do Supabase (banco + storage para PDFs)
- [ ] Login simples (email + senha para o único usuário)
- [ ] Deploy na Vercel via GitHub

#### Dados
- [ ] Upload dos PDFs das fichas para o Supabase Storage
- [ ] Cadastro estruturado das ~200 fichas no banco (pode ser feito em batches pelo time)

### O que fica FORA do MVP
- Edição de fichas dentro do sistema
- Recálculo automático quando preço de insumo muda
- Módulo de precificação
- Módulo de CMV
- Qualquer integração com PDV ou sistema de estoque

### Critério de sucesso do MVP
> O gestor consegue abrir o sistema, encontrar um prato pelo nome ou categoria, e visualizar o custo e os ingredientes — sem precisar abrir o Drive ou a planilha.

---

## Fase 2 — Precificação Visual

> **Objetivo:** O gestor consegue entender, para cada prato, como o preço de venda foi calculado e qual a margem real.

### Escopo

- [ ] Painel de precificação por prato com: CMV (R$), Multiplicador atual, Preço sugerido, Preço praticado, Margem real (%)
- [ ] Configuração do multiplicador de markup (editável pelo gestor)
- [ ] Comparativo visual: preço Ninny vs. faixa de mercado (usando os dados de benchmarking já levantados)
- [ ] Alerta para pratos com CMV acima de 38% (fora da faixa saudável do setor)
- [ ] Edição do preço de venda diretamente no sistema (recalcula a margem em tempo real)
- [ ] Tabela resumo: todos os pratos ordenados por margem (do maior para o menor)

---

## Fase 3 — Acompanhamento de CMV

> **Objetivo:** O gestor consegue visualizar o CMV consolidado do restaurante e entender a evolução ao longo do tempo.

### Escopo

- [ ] Dashboard de CMV com: CMV médio do cardápio, CMV por categoria, pratos com maior e menor margem
- [ ] Atualização de preço de insumos (quando um ingrediente fica mais caro, o sistema recalcula o CMV de todos os pratos que o usam)
- [ ] Histórico de variação de CMV por prato ao longo do tempo
- [ ] Relatório de rentabilidade por categoria (Sughi vs. Pratos Compostos vs. Entradas, etc.)
- [ ] Cadastro e edição de fichas técnicas diretamente no sistema (sem depender de PDF externo)

---

## Fase 4 — Visão Futura

> Funcionalidades que dependem de integrações externas ou de maturidade operacional maior.

- [ ] Integração com sistema de PDV (Consumer / VUCA) para puxar vendas e calcular CMV real vs. teórico
- [ ] CMV real por período (estoque inicial + compras − estoque final)
- [ ] DRE gerencial simplificada (Faturamento − CMV − Custos Fixos = Resultado)
- [ ] Alertas automáticos (ex: "o preço do queijo parmesão subiu — 12 fichas foram impactadas")
- [ ] Versão mobile para consulta rápida na cozinha

---

## Resumo Visual das Fases

```
FASE 1 (MVP)          FASE 2              FASE 3              FASE 4
─────────────         ──────────          ──────────          ──────────
Fichas Técnicas   →   Precificação    →   CMV Dashboard   →   Integração PDV
Catálogo visual       Markup visual       Atualização         CMV Real
Busca + filtros       Benchmarking        de insumos          DRE
PDF original          Alertas CMV         Histórico           Mobile
Login básico          Edit. de preço      Cadastro de
                                          fichas
```

---

## Dependências Críticas

| Item | Responsável | Status |
|---|---|---|
| PDFs das fichas técnicas | Já existem no Drive | ✅ Disponível |
| Dados estruturados (ingredientes + custos) | Time / extração dos PDFs | 🔄 A fazer |
| Preços de venda atuais | Planilha Plano de Contas | ✅ Disponível |
| Multiplicador de markup | Definido (≈ 3,90x) | ✅ Disponível |
| Dados de benchmarking | Planilha Comparativos | ✅ Disponível |
