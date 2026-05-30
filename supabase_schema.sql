-- ============================================
-- DnD Chronicle - Supabase Schema
-- Run this in the Supabase SQL Editor
-- ============================================

-- 1. PROFILES (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  role text not null default 'Player' check (role in ('Player', 'Dungeon Master')),
  avatar_url text,
  created_at timestamptz default now()
);
alter table public.profiles enable row level security;
create policy "Public profiles readable" on public.profiles for select using (true);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'role', 'Player')
  );
  return new;
end;
$$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 2. CHARACTERS
create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'Unnamed Hero',
  data jsonb not null default '{}',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
alter table public.characters enable row level security;
create policy "Users own their characters" on public.characters for all using (auth.uid() = user_id);

-- 3. CAMPAIGNS
create table if not exists public.campaigns (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  description text,
  invite_code text unique default upper(substring(gen_random_uuid()::text, 1, 8)),
  created_at timestamptz default now()
);
alter table public.campaigns enable row level security;
create policy "Owners manage campaigns" on public.campaigns for all using (auth.uid() = owner_id);
create policy "Players can read campaigns" on public.campaigns for select using (
  auth.uid() = owner_id or
  exists (select 1 from public.campaign_players where campaign_id = campaigns.id and user_id = auth.uid())
);

-- 4. CAMPAIGN PLAYERS (junction)
create table if not exists public.campaign_players (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid not null references public.campaigns(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  character_id uuid references public.characters(id) on delete set null,
  joined_at timestamptz default now(),
  unique(campaign_id, user_id)
);
alter table public.campaign_players enable row level security;
create policy "Campaign members readable" on public.campaign_players for select using (true);
create policy "Users join campaigns" on public.campaign_players for insert with check (auth.uid() = user_id);
create policy "Users leave campaigns" on public.campaign_players for delete using (auth.uid() = user_id);

-- 5. FRIEND REQUESTS
create table if not exists public.friend_requests (
  id uuid primary key default gen_random_uuid(),
  from_id uuid not null references public.profiles(id) on delete cascade,
  to_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'accepted', 'declined')),
  created_at timestamptz default now(),
  unique(from_id, to_id)
);
alter table public.friend_requests enable row level security;
create policy "Users see own requests" on public.friend_requests for select using (auth.uid() = from_id or auth.uid() = to_id);
create policy "Users send requests" on public.friend_requests for insert with check (auth.uid() = from_id);
create policy "Recipient updates requests" on public.friend_requests for update using (auth.uid() = to_id);
