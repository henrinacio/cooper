-- archive_student_note runs as invoker, blocked by RLS on student_note_history.
-- SECURITY DEFINER lets the trigger bypass RLS (correct for append-only audit log).
create or replace function public.archive_student_note()
returns trigger language plpgsql security definer
as $$
begin
  if old.content <> new.content then
    insert into public.student_note_history (note_id, content, edited_at)
    values (old.id, old.content, now());
  end if;
  return new;
end;
$$;
