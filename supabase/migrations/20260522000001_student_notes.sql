-- ============================================================
-- Student Notes
-- ============================================================

create table public.student_notes (
  id            uuid primary key default gen_random_uuid(),
  instructor_id uuid not null references public.profiles(id) on delete cascade,
  student_id    uuid not null references public.profiles(id) on delete cascade,
  course_id     uuid not null references public.courses(id) on delete cascade,
  content       text not null,
  tags          text[] not null default '{}',
  pinned        boolean not null default false,
  session_id    uuid references public.scheduled_sessions(id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index student_notes_instructor_course_idx on public.student_notes(instructor_id, course_id);
create index student_notes_student_course_idx on public.student_notes(student_id, course_id);
create index student_notes_instructor_student_idx on public.student_notes(instructor_id, student_id);

create trigger student_notes_updated_at
  before update on public.student_notes
  for each row execute function public.set_updated_at();

alter table public.student_notes enable row level security;

create policy "student_notes: instructor read own"
  on public.student_notes for select
  using (instructor_id = auth.uid());

create policy "student_notes: instructor insert"
  on public.student_notes for insert
  with check (
    instructor_id = auth.uid()
    and public.get_my_role() in ('instructor', 'admin')
  );

create policy "student_notes: instructor update own"
  on public.student_notes for update
  using (instructor_id = auth.uid())
  with check (instructor_id = auth.uid());

create policy "student_notes: instructor delete own"
  on public.student_notes for delete
  using (instructor_id = auth.uid());

-- ============================================================
-- Note History (append-only edit log via trigger)
-- ============================================================

create table public.student_note_history (
  id        uuid primary key default gen_random_uuid(),
  note_id   uuid not null references public.student_notes(id) on delete cascade,
  content   text not null,
  edited_at timestamptz not null default now()
);

create index student_note_history_note_id_idx on public.student_note_history(note_id);

alter table public.student_note_history enable row level security;

create policy "student_note_history: instructor read via note"
  on public.student_note_history for select
  using (
    exists (
      select 1 from public.student_notes sn
      where sn.id = note_id and sn.instructor_id = auth.uid()
    )
  );

-- Archive previous content before each update
create or replace function public.archive_student_note()
returns trigger language plpgsql
as $$
begin
  if old.content <> new.content then
    insert into public.student_note_history (note_id, content, edited_at)
    values (old.id, old.content, now());
  end if;
  return new;
end;
$$;

create trigger student_notes_archive
  before update on public.student_notes
  for each row execute function public.archive_student_note();
