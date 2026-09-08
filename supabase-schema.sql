create table if not exists catalog_categories (
  id text primary key,
  name text not null,
  icon text not null default 'category'
);

create table if not exists catalog_sub_categories (
  id text primary key,
  category_id text not null references catalog_categories(id) on delete cascade,
  name text not null
);

create table if not exists catalog_brands (
  id text primary key,
  name text not null,
  logo_url text not null default ''
);

create table if not exists catalog_products (
  id text primary key,
  name text not null,
  description text not null default '',
  image_url text not null default '',
  brand_id text not null references catalog_brands(id),
  category_id text not null references catalog_categories(id),
  sub_category_id text not null references catalog_sub_categories(id),
  created_at timestamptz not null default now()
);

create table if not exists catalog_product_variants (
  id text primary key,
  product_id text not null references catalog_products(id) on delete cascade,
  label text not null,
  price numeric(12,2) not null check (price >= 0),
  created_at timestamptz not null default now()
);

alter table catalog_categories enable row level security;
alter table catalog_sub_categories enable row level security;
alter table catalog_brands enable row level security;
alter table catalog_products enable row level security;
alter table catalog_product_variants enable row level security;

create policy "public catalog categories read" on catalog_categories for select using (true);
create policy "public catalog sub categories read" on catalog_sub_categories for select using (true);
create policy "public catalog brands read" on catalog_brands for select using (true);
create policy "public catalog products read" on catalog_products for select using (true);
create policy "public catalog variants read" on catalog_product_variants for select using (true);
