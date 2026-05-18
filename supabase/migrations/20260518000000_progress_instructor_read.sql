-- Allow course instructors to read progress records for lessons in their courses.
-- Drops the student-only policy and replaces it with one that also grants access
-- to the course instructor so they can track student progress.

drop policy "progress: read own" on public.progress;

create policy "progress: read own or course instructor"
  on public.progress for select
  using (
    user_id = auth.uid()
    or public.get_my_role() = 'admin'
    or exists (
      select 1
      from public.lessons l
      join public.modules m on l.module_id = m.id
      join public.courses c on m.course_id = c.id
      where l.id = progress.lesson_id
        and c.instructor_id = auth.uid()
    )
  );
