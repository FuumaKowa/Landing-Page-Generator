-- Do Good Agent Landing Page Builder
-- Supabase Database Schema
-- Local prototype migration target

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- =========================================================
-- Updated At Trigger Function
-- =========================================================

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- =========================================================
-- Table: agents
-- =========================================================

create table if not exists agents (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  slug text not null unique,
  whatsapp_number text,
  email text,
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint agents_status_check
    check (status in ('active', 'inactive', 'suspended'))
);

create trigger update_agents_updated_at
before update on agents
for each row
execute function update_updated_at_column();

create index if not exists agents_slug_idx on agents (slug);
create index if not exists agents_status_idx on agents (status);
create index if not exists agents_whatsapp_number_idx on agents (whatsapp_number);

-- =========================================================
-- Table: landing_page_submissions
-- =========================================================

create table if not exists landing_page_submissions (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete set null,
  slug text not null,
  status text not null default 'pending_review',
  payment_status text not null default 'unpaid',
  approval_status text not null default 'not_approved',
  revision_message text,
  admin_note text,
  page_data jsonb not null default '{}'::jsonb,
  submitted_at timestamptz not null default now(),
  resubmitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint landing_page_submissions_status_check
    check (status in (
      'draft',
      'pending_review',
      'needs_changes',
      'pending_payment',
      'approved',
      'published',
      'rejected'
    )),

  constraint landing_page_submissions_payment_status_check
    check (payment_status in (
      'unpaid',
      'payment_submitted',
      'payment_confirmed'
    )),

  constraint landing_page_submissions_approval_status_check
    check (approval_status in (
      'not_approved',
      'approved',
      'published'
    ))
);

create trigger update_landing_page_submissions_updated_at
before update on landing_page_submissions
for each row
execute function update_updated_at_column();

create index if not exists landing_page_submissions_agent_id_idx on landing_page_submissions (agent_id);
create index if not exists landing_page_submissions_slug_idx on landing_page_submissions (slug);
create index if not exists landing_page_submissions_status_idx on landing_page_submissions (status);
create index if not exists landing_page_submissions_payment_status_idx on landing_page_submissions (payment_status);
create index if not exists landing_page_submissions_approval_status_idx on landing_page_submissions (approval_status);
create index if not exists landing_page_submissions_submitted_at_idx on landing_page_submissions (submitted_at desc);
create index if not exists landing_page_submissions_page_data_idx on landing_page_submissions using gin (page_data);

-- =========================================================
-- Table: published_landing_pages
-- =========================================================

create table if not exists published_landing_pages (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid references landing_page_submissions(id) on delete set null,
  agent_id uuid references agents(id) on delete set null,
  slug text not null unique,
  public_path text not null unique,
  status text not null default 'published',
  page_data jsonb not null default '{}'::jsonb,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint published_landing_pages_status_check
    check (status in ('published', 'unpublished', 'archived'))
);

create trigger update_published_landing_pages_updated_at
before update on published_landing_pages
for each row
execute function update_updated_at_column();

create index if not exists published_landing_pages_submission_id_idx on published_landing_pages (submission_id);
create index if not exists published_landing_pages_agent_id_idx on published_landing_pages (agent_id);
create index if not exists published_landing_pages_slug_idx on published_landing_pages (slug);
create index if not exists published_landing_pages_public_path_idx on published_landing_pages (public_path);
create index if not exists published_landing_pages_status_idx on published_landing_pages (status);
create index if not exists published_landing_pages_page_data_idx on published_landing_pages using gin (page_data);

-- =========================================================
-- Table: payments
-- =========================================================

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid references agents(id) on delete set null,
  submission_id uuid references landing_page_submissions(id) on delete set null,
  amount numeric(10, 2),
  currency text not null default 'MYR',
  payment_method text,
  payment_status text not null default 'unpaid',
  payment_reference text,
  proof_url text,
  paid_at timestamptz,
  confirmed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint payments_payment_status_check
    check (payment_status in (
      'unpaid',
      'payment_submitted',
      'payment_confirmed',
      'rejected',
      'refunded'
    ))
);

create trigger update_payments_updated_at
before update on payments
for each row
execute function update_updated_at_column();

create index if not exists payments_agent_id_idx on payments (agent_id);
create index if not exists payments_submission_id_idx on payments (submission_id);
create index if not exists payments_payment_status_idx on payments (payment_status);
create index if not exists payments_created_at_idx on payments (created_at desc);

-- =========================================================
-- Table: admin_users
-- =========================================================

create table if not exists admin_users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique,
  full_name text not null,
  email text not null unique,
  role text not null default 'admin',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint admin_users_role_check
    check (role in ('super_admin', 'admin', 'reviewer')),

  constraint admin_users_status_check
    check (status in ('active', 'inactive'))
);

create trigger update_admin_users_updated_at
before update on admin_users
for each row
execute function update_updated_at_column();

create index if not exists admin_users_auth_user_id_idx on admin_users (auth_user_id);
create index if not exists admin_users_email_idx on admin_users (email);
create index if not exists admin_users_role_idx on admin_users (role);
create index if not exists admin_users_status_idx on admin_users (status);

-- =========================================================
-- Basic Row Level Security Setup
-- =========================================================
-- Policies will be refined later when Supabase Auth is connected.
-- For now, RLS is enabled but no public access policies are created yet.

alter table agents enable row level security;
alter table landing_page_submissions enable row level security;
alter table published_landing_pages enable row level security;
alter table payments enable row level security;
alter table admin_users enable row level security;

-- =========================================================
-- Public Read Policy for Published Pages
-- =========================================================
-- This allows public visitors to read only published landing pages.

create policy "Public can read published landing pages"
on published_landing_pages
for select
using (status = 'published');

-- =========================================================
-- Temporary Development Notes
-- =========================================================
-- Do not add broad public insert/update/delete policies for production.
-- Admin insert/update/delete rules should be added after Supabase Auth is configured.
-- Agent-specific rules should be added after the agent login flow is planned.

-- =========================================================
-- Temporary Development Policies
-- =========================================================
-- These allow local frontend testing before Supabase Auth is added.
-- Replace with admin-only policies before production.

create policy "Dev can insert published landing pages"
on published_landing_pages
for insert
with check (status = 'published');

create policy "Dev can update published landing pages"
on published_landing_pages
for update
using (true)
with check (status = 'published');

-- =========================================================
-- Temporary Development Submission Policies
-- =========================================================
-- Allows local frontend testing before Supabase Auth is added.
-- Replace with proper authenticated agent/admin policies before production.

drop policy if exists "Dev can insert landing page submissions" on landing_page_submissions;
drop policy if exists "Dev anon can insert landing page submissions" on landing_page_submissions;
drop policy if exists "Dev public can insert landing page submissions" on landing_page_submissions;
drop policy if exists "Dev public can read landing page submissions" on landing_page_submissions;

create policy "Dev public can insert landing page submissions"
on landing_page_submissions
for insert
to public
with check (
  status = 'pending_review'
  and payment_status = 'unpaid'
  and approval_status = 'not_approved'
);

create policy "Dev public can read landing page submissions"
on landing_page_submissions
for select
to public
using (true);

-- =========================================================
-- Temporary Development Submission Update Policy
-- =========================================================
-- Allows local admin dashboard testing before Supabase Auth is added.
-- Replace with proper admin-only policies before production.

drop policy if exists "Dev public can update landing page submissions" on landing_page_submissions;

create policy "Dev public can update landing page submissions"
on landing_page_submissions
for update
to public
using (true)
with check (true);