-- =============================================
-- ORDERS Admin Panel - Migration 2026-08-18
-- Kas & Transaksi, Payouts, Rapat, Status Member
-- Jalankan SEKALI di Supabase SQL Editor.
-- =============================================

-- PROFILES: status (active/inactive)
alter table public.profiles
  add column if not exists status text not null default 'active'
  check (status in ('active', 'inactive'));

-- TRANSACTIONS (buku kas)
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

-- PAYOUTS (pencairan dana ke member)
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

-- PAYOUT_MEMBERS (rincian per member)
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

-- MEETING_NOTES (catatan rapat)
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

-- MEETING_NOTE_ATTENDEES (peserta rapat)
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

-- ACTION_ITEMS (tindak lanjut rapat)
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

-- Indexes
create index if not exists idx_transactions_date on public.transactions (date);
create index if not exists idx_transactions_type on public.transactions (type);
create index if not exists idx_payouts_status on public.payouts (status);
create index if not exists idx_payout_members_payout on public.payout_members (payout_id);
create index if not exists idx_meeting_notes_date on public.meeting_notes (date);
create index if not exists idx_action_items_note on public.action_items (meeting_note_id);