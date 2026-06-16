-- ============================================================
--  Ninny BSFT — Regras de acesso (RLS) para usuários logados
-- ============================================================
--  Cole TODO este conteúdo no Supabase → SQL Editor → Run.
--  Pode rodar mais de uma vez sem problema (é idempotente).
--
--  O que faz: permite que usuários LOGADOS leiam e atualizem
--  os dados. Quem não está logado não acessa.
-- ============================================================

-- Garante que a proteção (RLS) está ligada
alter table recipes             enable row level security;
alter table recipe_ingredients  enable row level security;
alter table ingredients         enable row level security;

-- recipes: ler e atualizar (logados)
drop policy if exists "ninny_auth_select_recipes" on recipes;
create policy "ninny_auth_select_recipes" on recipes
  for select to authenticated using (true);

drop policy if exists "ninny_auth_update_recipes" on recipes;
create policy "ninny_auth_update_recipes" on recipes
  for update to authenticated using (true) with check (true);

-- recipe_ingredients: ler (logados)
drop policy if exists "ninny_auth_select_recipe_ingredients" on recipe_ingredients;
create policy "ninny_auth_select_recipe_ingredients" on recipe_ingredients
  for select to authenticated using (true);

-- ingredients: ler (logados)
drop policy if exists "ninny_auth_select_ingredients" on ingredients;
create policy "ninny_auth_select_ingredients" on ingredients
  for select to authenticated using (true);
