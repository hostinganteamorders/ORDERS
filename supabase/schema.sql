-- =============================================
-- ORDERS Admin Panel - Database Schema
-- Run this in Supabase SQL Editor (or via supabase db push)
-- =============================================

-- =============================================
-- PROFILES (extends auth.users)
-- =============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '',
  role text not null default 'Member',
  avatar_url text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Helper: is the current user an admin?
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and is_admin = true
  );
$$;

create policy "profiles are readable by all authenticated users"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "only admins can insert profiles"
  on public.profiles for insert
  with check (public.is_admin());

create policy "only admins can delete profiles"
  on public.profiles for delete
  using (public.is_admin());

-- =============================================
-- PROJECTS
-- =============================================
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  client_name text,
  description text,
  total_value numeric(15,2) not null default 0,
  status text not null default 'active'
    check (status in ('active', 'completed', 'paid')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.projects enable row level security;

create policy "projects are readable by all authenticated users"
  on public.projects for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert projects"
  on public.projects for insert
  with check (public.is_admin());

create policy "only admins can update projects"
  on public.projects for update
  using (public.is_admin());

create policy "only admins can delete projects"
  on public.projects for delete
  using (public.is_admin());

-- =============================================
-- PROJECT_MEMBERS (contribution per project)
-- =============================================
create table if not exists public.project_members (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  profile_id uuid not null references public.profiles (id) on delete cascade,
  contribution_percent numeric(5,2) not null default 0
    check (contribution_percent >= 0 and contribution_percent <= 100),
  created_at timestamptz not null default now(),
  unique (project_id, profile_id)
);

alter table public.project_members enable row level security;

create policy "project_members are readable by all authenticated users"
  on public.project_members for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert project_members"
  on public.project_members for insert
  with check (public.is_admin());

create policy "only admins can update project_members"
  on public.project_members for update
  using (public.is_admin());

create policy "only admins can delete project_members"
  on public.project_members for delete
  using (public.is_admin());

-- =============================================
-- DISTRIBUTIONS (riwayat bagi hasil)
-- =============================================
create table if not exists public.distributions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  total_value numeric(15,2) not null default 0,
  kas_orders_percent numeric(5,2) not null default 10,
  kas_orders_amount numeric(15,2) not null default 0,
  member_amount numeric(15,2) not null default 0,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.distributions enable row level security;

create policy "distributions are readable by all authenticated users"
  on public.distributions for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert distributions"
  on public.distributions for insert
  with check (public.is_admin());

create policy "only admins can update distributions"
  on public.distributions for update
  using (public.is_admin());

create policy "only admins can delete distributions"
  on public.distributions for delete
  using (public.is_admin());

-- =============================================
-- TASKS (jadwal / pembagian tugas)
-- =============================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  project_id uuid references public.projects (id) on delete set null,
  assigned_to uuid references public.profiles (id) on delete set null,
  start_at timestamptz,
  end_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'in_progress', 'done')),
  color text default '#FF7A00',
  google_event_id text,
  source text not null default 'web' check (source in ('web', 'google')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.tasks enable row level security;

create policy "tasks are readable by all authenticated users"
  on public.tasks for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert tasks"
  on public.tasks for insert
  with check (public.is_admin());

create policy "only admins can update tasks"
  on public.tasks for update
  using (public.is_admin());

create policy "only admins can delete tasks"
  on public.tasks for delete
  using (public.is_admin());

-- =============================================
-- CALENDAR_TOKENS (Google OAuth tokens)
-- =============================================
create table if not exists public.calendar_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  access_token text,
  refresh_token text,
  expiry_at timestamptz,
  google_email text,
  scope text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id)
);

alter table public.calendar_tokens enable row level security;

create policy "users can read their own calendar token"
  on public.calendar_tokens for select
  using (auth.uid() = user_id);

create policy "users can insert their own calendar token"
  on public.calendar_tokens for insert
  with check (auth.uid() = user_id);

create policy "users can update their own calendar token"
  on public.calendar_tokens for update
  using (auth.uid() = user_id);

create policy "users can delete their own calendar token"
  on public.calendar_tokens for delete
  using (auth.uid() = user_id);

-- =============================================
-- Indexes
-- =============================================
create index if not exists idx_project_members_project on public.project_members (project_id);
create index if not exists idx_project_members_profile on public.project_members (profile_id);
create index if not exists idx_tasks_assigned_to on public.tasks (assigned_to);
create index if not exists idx_tasks_start_at on public.tasks (start_at);
create index if not exists idx_distributions_project on public.distributions (project_id);
