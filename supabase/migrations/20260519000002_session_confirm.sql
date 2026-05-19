alter table public.scheduled_sessions
  add column confirmed boolean not null default false;

create policy "sessions: student confirm"
  on public.scheduled_sessions for update
  using (student_id = auth.uid())
  with check (student_id = auth.uid());
