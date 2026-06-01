-- =============================================
-- SEED: Ingredientes base do Ninny
-- =============================================
insert into ingredients (name, unit, unit_cost) values
  ('Pão Italiano', 'g', 0.0438),
  ('Orégano', 'g', 0.036),
  ('Molho Bruschetta', 'g', 0.0214),
  ('Queijo Provolone', 'g', 0.0451),
  ('Queijo Mussarela', 'g', 0.0258),
  ('Tomate Grape', 'g', 0.0179),
  ('Tomate Seco', 'g', 0.017),
  ('Azeitona', 'g', 0.0294),
  ('Tomate Italiano', 'g', 0.0072),
  ('Manjericão', 'g', 0.0184),
  ('Azeite', 'ml', 0.0685),
  ('Lagarto', 'g', 0.032),
  ('Limão', 'g', 0.00375),
  ('Pesto', 'g', 0.0683),
  ('Queijo Parmesão', 'g', 0.0477),
  ('Rúcula', 'g', 0.0228),
  ('Champignon', 'g', 0.0349),
  ('Alcaparra', 'g', 0.0389),
  ('Alface Americana', 'g', 0.0233),
  ('Rúcula Maço', 'g', 0.0228),
  ('Mussarela Búfala', 'g', 0.058),
  ('Vinagre', 'ml', 0.0044),
  ('Massa Fresca', 'g', 0.018),
  ('Manteiga', 'g', 0.028),
  ('Molho de Tomate', 'g', 0.015),
  ('Bacon', 'g', 0.035),
  ('Ovo', 'g', 0.018),
  ('Carne Moída Bovina', 'g', 0.038),
  ('Cebola', 'g', 0.008),
  ('Alho', 'g', 0.012),
  ('Creme de Leite', 'ml', 0.022),
  ('Queijo Parmigiano', 'g', 0.055),
  ('Biscoito Champagne', 'g', 0.032),
  ('Mascarpone', 'g', 0.048),
  ('Café Expresso', 'ml', 0.05),
  ('Cacau em Pó', 'g', 0.038)
on conflict do nothing;

-- =============================================
-- SEED: Fichas Técnicas (baseadas nos PDFs reais)
-- =============================================

-- ENTRADAS
with bruschetta as (
  insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup)
  values ('Bruschetta', 'entradas', 110, 3.41, 49.00, 3.9)
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_name, gross_weight, net_weight, unit, unit_cost)
select b.id, ing.name, ing.gross, ing.net, ing.unit, ing.cost
from bruschetta b,
(values
  ('Pão Italiano',     35, 35, 'g', 0.0438),
  ('Orégano',           1,  1, 'g', 0.036),
  ('Molho Bruschetta', 65, 65, 'g', 0.0214),
  ('Queijo Provolone', 10, 10, 'g', 0.0451)
) as ing(name, gross, net, unit, cost);

with caprese as (
  insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup)
  values ('Salada Caprese', 'entradas', 820, 13.65, 69.00, 3.9)
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_name, gross_weight, net_weight, unit, unit_cost)
select c.id, ing.name, ing.gross, ing.net, ing.unit, ing.cost
from caprese c,
(values
  ('Queijo Mussarela', 175, 175, 'g', 0.0258),
  ('Tomate Grape',      95,  95, 'g', 0.0179),
  ('Tomate Seco',       85,  85, 'g', 0.017),
  ('Azeitona',          85,  85, 'g', 0.0294),
  ('Tomate Italiano',  370, 370, 'g', 0.0072),
  ('Manjericão',         5,   5, 'g', 0.0184),
  ('Orégano',            1,   1, 'g', 0.036),
  ('Azeite',            10,  10, 'ml', 0.0685)
) as ing(name, gross, net, unit, cost);

with carpaccio as (
  insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup)
  values ('Carpaccio di Carne', 'entradas', 565, 15.42, 89.00, 3.9)
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_name, gross_weight, net_weight, unit, unit_cost)
select c.id, ing.name, ing.gross, ing.net, ing.unit, ing.cost
from carpaccio c,
(values
  ('Lagarto',          115, 115, 'g', 0.032),
  ('Limão',            110, 110, 'g', 0.00375),
  ('Pesto',             36,  36, 'g', 0.0683),
  ('Queijo Parmesão',   42,  42, 'g', 0.0477),
  ('Rúcula',            31,  31, 'g', 0.0228),
  ('Champignon',        32,  32, 'g', 0.0349),
  ('Azeitona',          60,  60, 'g', 0.0294),
  ('Alcaparra',         10,  10, 'g', 0.0389),
  ('Azeite',            10,  10, 'ml', 0.0685)
) as ing(name, gross, net, unit, cost);

with insalata as (
  insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup)
  values ('Insalata', 'entradas', 258, 11.40, 74.00, 3.9)
  returning id
)
insert into recipe_ingredients (recipe_id, ingredient_name, gross_weight, net_weight, unit, unit_cost)
select i.id, ing.name, ing.gross, ing.net, ing.unit, ing.cost
from insalata i,
(values
  ('Alface Americana', 105, 56, 'g', 0.0233),
  ('Rúcula Maço',       22, 13, 'g', 0.0228),
  ('Queijo Parmesão',   26, 22, 'g', 0.0477),
  ('Champignon',        38, 28, 'g', 0.0349),
  ('Azeitona',          34, 27, 'g', 0.0294),
  ('Alcaparra',         17, 10, 'g', 0.0389),
  ('Tomate Seco',       42, 35, 'g', 0.017),
  ('Mussarela Búfala',  33, 33, 'g', 0.058),
  ('Tomate Grape',      53, 28, 'g', 0.0179)
) as ing(name, gross, net, unit, cost);

-- SUGHI
insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup) values
  ('Al Burro e Sugo',                   'sughi', 300,  9.29, 89.00, 3.9),
  ('All''Aglio, Olio e Peperoncino',    'sughi', 280,  7.93, 89.00, 3.9),
  ('Alla Bolognese',                    'sughi', 320, 11.20, 89.00, 3.9),
  ('Alla Carbonara',                    'sughi', 340, 13.80, 89.00, 3.9),
  ('All''Amatriciana',                  'sughi', 310, 10.50, 89.00, 3.9),
  ('Molho Branco',                      'sughi', 290, 11.52, 89.00, 3.9),
  ('All''Arrabbiata',                   'sughi', 290, 13.01, 89.00, 3.9),
  ('Alla Norma',                        'sughi', 300, 10.80, 89.00, 3.9),
  ('Alla Sorrentina',                   'sughi', 310, 12.40, 89.00, 3.9),
  ('Alla Puttanesca',                   'sughi', 300, 11.90, 89.00, 3.9),
  ('Al Pesto alla Genovese',            'sughi', 280,  9.80, 89.00, 3.9),
  ('Pomodoro e Basilico',               'sughi', 280,  8.20, 89.00, 3.9),
  ('Alla Ninny',                        'sughi', 310, 14.20, 89.00, 3.9),
  ('Al Picchio Pacchio',                'sughi', 290, 10.10, 89.00, 3.9),
  ('Al Quattro Formaggi',               'sughi', 300, 13.50, 89.00, 3.9);

-- SUGHI SPECIAL
insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup) values
  ('Alfredo',           'sughi_special', 290, 18.20, 129.00, 3.9),
  ('Diavola',           'sughi_special', 300, 22.10, 129.00, 3.9),
  ('Al Ragù',           'sughi_special', 320, 24.50, 129.00, 3.9),
  ('Al Funghi Porcini', 'sughi_special', 300, 28.50, 129.00, 3.9),
  ('Al Salmone',        'sughi_special', 310, 32.40, 129.00, 3.9);

-- SUGHI AL MARE
insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup) values
  ('Sughi Al Mare Individual', 'sughi_al_mare', 350, 38.20, 149.00, 3.9),
  ('Al Gamberi',               'sughi_al_mare', 340, 42.10, 159.00, 3.9),
  ('Alla Pescatora',           'sughi_al_mare', 360, 45.80, 159.00, 3.9),
  ('Al Nero di Seppia',        'sughi_al_mare', 330, 36.90, 159.00, 3.9);

-- PRATOS COMPOSTOS
insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup) values
  ('Lasanha Bolognese',        'pratos_compostos', 400, 14.80, 119.00, 3.9),
  ('Gnocchi Individual',       'pratos_compostos', 350, 16.20, 119.00, 3.9),
  ('Ravioli Individual',       'pratos_compostos', 330, 18.50, 119.00, 3.9),
  ('Filé à Parmegiana',        'pratos_compostos', 450, 42.10, 129.00, 3.9),
  ('Filetto Biscottato',       'pratos_compostos', 400, 35.20, 98.00,  3.9),
  ('Filé alla Pizzaiola',      'pratos_compostos', 420, 38.40, 129.00, 3.9),
  ('Filé alla Boscaiola',      'pratos_compostos', 420, 40.10, 129.00, 3.9),
  ('Parmegiana de Carne',      'pratos_compostos', 430, 41.80, 129.00, 3.9),
  ('Papardelle al Sugo de Polpette', 'pratos_compostos', 380, 22.30, 129.00, 3.9);

-- RISOTO
insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup) values
  ('Risoto de Funghi', 'risoto', 380, 24.30, 99.00, 3.9);

-- SOBREMESA
insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup) values
  ('Tiramisù', 'sobremesa', 140, 6.13, 39.00, 3.9);

-- MENU EXECUTIVO (com ingredientes detalhados das planilhas)
insert into recipes (name, category, portion_size_g, total_cost, sale_price, markup) values
  ('Executivo Quatro Queijos (100g)',              'menu_executivo', 392,  9.31, 79.90, 3.9),
  ('Executivo Pomodoro + 2 Polpetes',             'menu_executivo', 495, 11.08, 79.90, 3.9),
  ('Executivo Amatriciana (100g)',                 'menu_executivo', 365,  7.68, 79.90, 3.9),
  ('Executivo Carbonara (120g)',                   'menu_executivo', 385, 10.19, 79.90, 3.9),
  ('Executivo Alho e Óleo (120g)',                 'menu_executivo', 330,  4.64, 79.90, 3.9);
