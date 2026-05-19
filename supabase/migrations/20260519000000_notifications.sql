-- ============================================================
-- Notifications
-- ============================================================

create table public.notifications (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null references public.profiles(id) on delete cascade,
  actor_id   uuid references public.profiles(id) on delete set null,
  type       text not null,
  metadata   jsonb not null default '{}',
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index notifications_user_id_idx on public.notifications(user_id);
create index notifications_unread_idx on public.notifications(user_id) where not read;

alter table public.notifications enable row level security;

create policy "notifications: read own"
  on public.notifications for select
  using (user_id = auth.uid());

create policy "notifications: update own"
  on public.notifications for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- Security definer so any authenticated user can create notifications for others
create or replace function public.create_notification(
  p_user_id  uuid,
  p_actor_id uuid,
  p_type     text,
  p_metadata jsonb default '{}'
) returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.notifications (user_id, actor_id, type, metadata)
  values (p_user_id, p_actor_id, p_type, p_metadata);
end;
$$;
