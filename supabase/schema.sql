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
-- PROFILES: status (active/inactive)
-- =============================================
alter table public.profiles
  add column if not exists status text not null default 'active'
  check (status in ('active', 'inactive'));

-- =============================================
-- TRANSACTIONS (buku kas)
-- =============================================
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  type text not null check (type in ('income', 'expense')),
  amount numeric(15,2) not null default 0 check (amount >= 0),
  source text not null default '',
  description text not null default '',
  reference text not null default '',
  project_id uuid references public.projects (id) on delete set null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.transactions enable row level security;

create policy "transactions are readable by all authenticated users"
  on public.transactions for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert transactions"
  on public.transactions for insert
  with check (public.is_admin());

create policy "only admins can update transactions"
  on public.transactions for update
  using (public.is_admin());

create policy "only admins can delete transactions"
  on public.transactions for delete
  using (public.is_admin());

-- =============================================
-- PAYOUTS (pencairan dana ke member)
-- =============================================
create table if not exists public.payouts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects (id) on delete set null,
  project_name text not null default '',
  date date not null,
  total_amount numeric(15,2) not null default 0,
  orders_fee numeric(15,2) not null default 0,
  net_amount numeric(15,2) not null default 0,
  status text not null default 'pending'
    check (status in ('pending', 'processing', 'paid')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.payouts enable row level security;

create policy "payouts are readable by all authenticated users"
  on public.payouts for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert payouts"
  on public.payouts for insert
  with check (public.is_admin());

create policy "only admins can update payouts"
  on public.payouts for update
  using (public.is_admin());

create policy "only admins can delete payouts"
  on public.payouts for delete
  using (public.is_admin());

-- =============================================
-- PAYOUT_MEMBERS (rincian per member)
-- =============================================
create table if not exists public.payout_members (
  id uuid primary key default gen_random_uuid(),
  payout_id uuid not null references public.payouts (id) on delete cascade,
  member_id uuid references public.profiles (id) on delete set null,
  name text not null default '',
  contribution_percent numeric(5,2) not null default 0,
  amount numeric(15,2) not null default 0,
  created_at timestamptz not null default now()
);

alter table public.payout_members enable row level security;

create policy "payout_members are readable by all authenticated users"
  on public.payout_members for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert payout_members"
  on public.payout_members for insert
  with check (public.is_admin());

create policy "only admins can update payout_members"
  on public.payout_members for update
  using (public.is_admin());

create policy "only admins can delete payout_members"
  on public.payout_members for delete
  using (public.is_admin());

-- =============================================
-- MEETING_NOTES (catatan rapat)
-- =============================================
create table if not exists public.meeting_notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date not null,
  agenda text,
  notes text,
  project_id uuid references public.projects (id) on delete set null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.meeting_notes enable row level security;

create policy "meeting_notes are readable by all authenticated users"
  on public.meeting_notes for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert meeting_notes"
  on public.meeting_notes for insert
  with check (public.is_admin());

create policy "only admins can update meeting_notes"
  on public.meeting_notes for update
  using (public.is_admin());

create policy "only admins can delete meeting_notes"
  on public.meeting_notes for delete
  using (public.is_admin());

-- =============================================
-- MEETING_NOTE_ATTENDEES (peserta rapat)
-- =============================================
create table if not exists public.meeting_note_attendees (
  id uuid primary key default gen_random_uuid(),
  meeting_note_id uuid not null references public.meeting_notes (id) on delete cascade,
  member_id uuid not null references public.profiles (id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (meeting_note_id, member_id)
);

alter table public.meeting_note_attendees enable row level security;

create policy "meeting_note_attendees are readable by all authenticated users"
  on public.meeting_note_attendees for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert meeting_note_attendees"
  on public.meeting_note_attendees for insert
  with check (public.is_admin());

create policy "only admins can delete meeting_note_attendees"
  on public.meeting_note_attendees for delete
  using (public.is_admin());

-- =============================================
-- ACTION_ITEMS (tindak lanjut rapat)
-- =============================================
create table if not exists public.action_items (
  id uuid primary key default gen_random_uuid(),
  meeting_note_id uuid not null references public.meeting_notes (id) on delete cascade,
  task text not null,
  assigned_to uuid references public.profiles (id) on delete set null,
  due_date date,
  status text not null default 'pending'
    check (status in ('pending', 'completed')),
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

alter table public.action_items enable row level security;

create policy "action_items are readable by all authenticated users"
  on public.action_items for select
  using (auth.role() = 'authenticated');

create policy "only admins can insert action_items"
  on public.action_items for insert
  with check (public.is_admin());

create policy "only admins can update action_items"
  on public.action_items for update
  using (public.is_admin());

create policy "only admins can delete action_items"
  on public.action_items for delete
  using (public.is_admin());

-- =============================================
-- Indexes
-- =============================================
create index if not exists idx_project_members_project on public.project_members (project_id);
create index if not exists idx_project_members_profile on public.project_members (profile_id);
create index if not exists idx_tasks_assigned_to on public.tasks (assigned_to);
create index if not exists idx_tasks_start_at on public.tasks (start_at);
create index if not exists idx_transactions_date on public.transactions (date);
create index if not exists idx_transactions_type on public.transactions (type);
create index if not exists idx_payouts_status on public.payouts (status);
create index if not exists idx_payout_members_payout on public.payout_members (payout_id);
create index if not exists idx_meeting_notes_date on public.meeting_notes (date);
create index if not exists idx_action_items_note on public.action_items (meeting_note_id);
