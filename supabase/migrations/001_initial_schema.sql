-- Tabela de ingredientes (insumos com preço)
create table if not exists ingredients (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  unit text not null default 'g',
  unit_cost numeric(10, 4) not null default 0,
  updated_at timestamptz not null default now()
);

-- Tabela de fichas técnicas
create table if not exists recipes (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null check (category in (
    'entradas','sughi','sughi_special','sughi_al_mare',
    'pratos_compostos','pratos_duplos','risoto',
    'sobremesa','bebidas','menu_executivo','preparos'
  )),
  portion_size_g numeric(10, 2) not null default 0,
  total_cost numeric(10, 4) not null default 0,
  sale_price numeric(10, 2) not null default 0,
  markup numeric(10, 4) not null default 3.9,
  cmv_pct numeric(10, 4) generated always as (
    case when sale_price > 0 then (total_cost / sale_price) * 100 else 0 end
  ) stored,
  pdf_url text,
  created_at timestamptz not null default now()
);

-- Tabela de composição das fichas (ingredientes por ficha)
create table if not exists recipe_ingredients (
  id uuid primary key default gen_random_uuid(),
  recipe_id uuid not null references recipes(id) on delete cascade,
  ingredient_id uuid references ingredients(id) on delete set null,
  ingredient_name text not null,
  gross_weight numeric(10, 4) not null default 0,
  net_weight numeric(10, 4) not null default 0,
  unit text not null default 'g',
  unit_cost numeric(10, 4) not null default 0,
  total_cost numeric(10, 4) generated always as (net_weight * unit_cost) stored
);

-- Índices para performance
create index if not exists recipes_category_idx on recipes(category);
create index if not exists recipe_ingredients_recipe_idx on recipe_ingredients(recipe_id);

-- RLS (Row Level Security) - acesso público de leitura por enquanto
alter table ingredients enable row level security;
alter table recipes enable row level security;
alter table recipe_ingredients enable row level security;

create policy "Leitura pública" on ingredients for select using (true);
create policy "Leitura pública" on recipes for select using (true);
create policy "Leitura pública" on recipe_ingredients for select using (true);

create policy "Escrita autenticada" on ingredients for all using (auth.role() = 'authenticated');
create policy "Escrita autenticada" on recipes for all using (auth.role() = 'authenticated');
create policy "Escrita autenticada" on recipe_ingredients for all using (auth.role() = 'authenticated');
