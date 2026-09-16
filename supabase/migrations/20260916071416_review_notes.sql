create table if not exists public.review_notes (
  id uuid primary key default gen_random_uuid(),
  page_path text not null check (char_length(trim(page_path)) between 1 and 500),
  element_label text not null check (char_length(trim(element_label)) between 1 and 220),
  anchor jsonb not null default '{}'::jsonb,
  message text not null check (char_length(trim(message)) between 3 and 3000),
  status text not null default 'open' check (status in ('open', 'in_progress', 'resolved', 'archived')),
  author_id uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

alter table public.review_notes enable row level security;

revoke all on table public.review_notes from anon, authenticated;

create index if not exists review_notes_open_created_at_idx
  on public.review_notes (status, created_at desc);
