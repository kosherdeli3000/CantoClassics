-- 唐詩日記 Database Schema
-- Run this in the Supabase SQL editor to set up the database

create table if not exists poems (
  id uuid default gen_random_uuid() primary key,
  date date unique not null,          -- Thursday date (week start)
  title_zh text not null,
  title_en text not null,
  author_zh text not null,
  author_en text not null,
  lines_zh text[] not null,
  lines_jyutping text[] not null,
  translation_en text not null,
  line_by_line jsonb not null,
  vocabulary jsonb not null,
  author_bio text not null,
  poem_background text not null,
  literary_note text not null,
  sources text[] not null,
  season_hint text,
  image_prompts text[],               -- 7 evolving prompts (Thu-Wed)
  daily_images jsonb,                 -- {"thu": "url", "fri": "url", ...}
  created_at timestamptz default now()
);

create table if not exists favorites (
  id uuid default gen_random_uuid() primary key,
  poem_id uuid references poems(id) unique,
  favorited_at timestamptz default now()
);

create table if not exists seen_poems (
  id uuid default gen_random_uuid() primary key,
  poem_id uuid references poems(id),
  seen_at timestamptz default now()
);

-- Allow anonymous read access (no auth required)
alter table poems enable row level security;
create policy "Anyone can read poems" on poems for select using (true);

alter table favorites enable row level security;
create policy "Anyone can read favorites" on favorites for select using (true);
create policy "Anyone can insert favorites" on favorites for insert with check (true);
create policy "Anyone can delete favorites" on favorites for delete using (true);

alter table seen_poems enable row level security;
create policy "Anyone can read seen_poems" on seen_poems for select using (true);
create policy "Anyone can insert seen_poems" on seen_poems for insert with check (true);

-- Index for fast date lookups
create index if not exists idx_poems_date on poems(date);
