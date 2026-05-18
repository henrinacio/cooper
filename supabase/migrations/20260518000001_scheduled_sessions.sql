-- ============================================================
-- Scheduled Sessions
-- ============================================================

create table public.scheduled_sessions (
  id            uuid primary key default gen_random_uuid(),
  course_id     uuid not null references public.courses(id) on delete cascade,
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  title         text not null,
  scheduled_at  timestamptz not null,
  duration_min  integer not null default 60,
  notes         text,
  created_at    timestamptz not null default now()
);

create index scheduled_sessions_instructor_idx on public.scheduled_sessions(instructor_id);
create index scheduled_sessions_student_idx on public.scheduled_sessions(student_id);
create index scheduled_sessions_at_idx on public.scheduled_sessions(scheduled_at);

alter table public.scheduled_sessions enable row level security;

create policy "sessions: read own"
  on public.scheduled_sessions for select
  using (instructor_id = auth.uid() or student_id = auth.uid());

create policy "sessions: instructor insert"
  on public.scheduled_sessions for insert
  with check (
    instructor_id = auth.uid()
    and public.get_my_role() in ('instructor', 'admin')
    and public.is_course_instructor(course_id)
  );

create policy "sessions: instructor update"
  on public.scheduled_sessions for update
  using (instructor_id = auth.uid())
  with check (instructor_id = auth.uid());

create policy "sessions: instructor delete"
  on public.scheduled_sessions for delete
  using (instructor_id = auth.uid());
