# Tech Stack — Ninny BSFT

## Princípios de Arquitetura

- **Simplicidade acima de tudo** — o usuário final tem baixa familiaridade com sistemas digitais; a stack deve produzir interfaces visuais e responsivas sem complexidade desnecessária
- **Deploy rápido** — Vercel como plataforma de hospedagem, GitHub como repositório
- **Dados vindos do Drive** — as fichas técnicas já existem como PDFs no Google Drive; a estratégia de dados deve contemplar importação e armazenamento dessas informações
- **Single-user** — sem necessidade de sistema de autenticação complexo no MVP; proteção simples por variável de ambiente ou senha estática é suficiente

---

## Stack Definida

### Front-end

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Framework | **React + Vite** | Ecossistema familiar, build rápido, excelente suporte Vercel |
| Linguagem | **TypeScript** | Tipagem dos dados de fichas técnicas evita bugs silenciosos |
| Estilização | **Tailwind CSS** | Desenvolvimento visual ágil, sem overhead de CSS customizado |
| Componentes | **shadcn/ui** | Componentes acessíveis e visualmente limpos, sem opinião excessiva |
| Gráficos / Visualizações | **Recharts** | Leve, declarativo, ideal para exibição de CMV e margens |
| Roteamento | **React Router v6** | Navegação entre módulos (Fichas, Precificação, CMV) |

### Back-end / Dados

| Camada | Tecnologia | Justificativa |
|---|---|---|
| Banco de dados | **Supabase (PostgreSQL)** | Banco gerenciado, API REST/RealTime gratuita no nível de uso atual, SDK TypeScript nativo |
| Armazenamento de PDFs | **Supabase Storage** | Armazena os PDFs das fichas técnicas para acesso e download direto no sistema |
| Autenticação | **Supabase Auth** (email + senha) | Login simples para o único usuário; protege dados financeiros sensíveis |

### Infraestrutura

| Camada | Tecnologia |
|---|---|
| Hospedagem | **Vercel** |
| Repositório | **GitHub** (Droaquino/Ninny-BSFT) |
| CI/CD | Vercel GitHub Integration (deploy automático no push para `main`) |

---

## Modelagem de Dados (MVP)

### Tabela `ingredients` — Insumos com preço
```
id, name, unit (g/ml/un), unit_cost, updated_at
```

### Tabela `recipes` — Fichas Técnicas
```
id, name, category, portion_size_g, total_cost, sale_price, markup, cmv_pct, pdf_url, created_at
```

### Tabela `recipe_ingredients` — Composição da ficha
```
id, recipe_id, ingredient_id, gross_weight, net_weight, unit, unit_cost
```

### Categorias de pratos (enum)
`entradas` | `sughi` | `sughi_special` | `sughi_al_mare` | `pratos_compostos` | `pratos_duplos` | `risoto` | `sobremesa` | `bebidas` | `menu_executivo` | `preparos`

---

## Lógica de Precificação

A lógica atual do Ninny usa markup composto:

```
Markup Multiplicador = 1 / (1 - CMV% - Custos_Fixos% - Margem_Pretendida%)

Exemplo real Ninny:
  Custos Fixos / Faturamento = 44,36%
  Margem Pretendida = 30%
  Denominador = 1 - (0,4436 + 0,30) = 0,2564
  Multiplicador ≈ 3,90x

Preço Final = CMV do Prato × 3,90
```

O sistema deve armazenar o multiplicador configurável e recalcular automaticamente quando o custo de algum ingrediente mudar.

---

## Estratégia de Migração dos Dados

Os PDFs das fichas já existem no Google Drive organizados por categoria. A estratégia de migração é:

1. **Fase 1 (MVP):** Upload manual dos PDFs para o Supabase Storage + cadastro manual dos dados estruturados (nome, ingredientes, custos) via painel admin simples
2. **Fase 2:** Formulário de cadastro dentro do próprio sistema para novas fichas
3. **Fase 3 (futuro):** Eventual integração com Google Drive para sincronização automática

---

## Decisões Técnicas Relevantes

- **Por que não usar a planilha diretamente?** A planilha Excel/Google Sheets tem limitações de visualização para o perfil do usuário; o banco relacional permite filtros, cálculos e atualizações em cascata quando o preço de um insumo muda
- **Por que Supabase e não Firebase?** PostgreSQL relacional é mais adequado para dados com relações (ficha → ingredientes → custos); o Supabase oferece acesso SQL direto útil para relatórios futuros
- **Por que manter os PDFs originais?** O usuário já conhece o formato; servir o PDF é a forma mais rápida de entregar valor no MVP sem re-criar o design das fichas
