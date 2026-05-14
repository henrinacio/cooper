-- ============================================================
-- Access control: instructor-granted enrollment
-- Replaces open "anyone reads published" and "self enroll" model.
-- ============================================================

-- ---- Update course read policy ---------------------------------
-- Before: any authenticated user could see all published courses.
-- After:  only enrolled students (on published courses) + instructor + admin.

drop policy "courses: anyone reads published" on public.courses;

create policy "courses: enrolled or instructor reads"
  on public.courses for select
  using (
    instructor_id = auth.uid()
    or public.get_my_role() = 'admin'
    or (published = true and public.is_enrolled(id))
  );

-- ---- Update enrollment policies --------------------------------
-- Before: students could enroll themselves.
-- After:  only the course instructor (or admin) can add enrollments.

drop policy "enrollments: read own" on public.enrollments;
drop policy "enrollments: self enroll" on public.enrollments;
drop policy "enrollments: self or admin delete" on public.enrollments;

create policy "enrollments: read if own or instructor"
  on public.enrollments for select
  using (
    user_id = auth.uid()
    or public.is_course_instructor(course_id)
    or public.get_my_role() = 'admin'
  );

create policy "enrollments: instructor or admin insert"
  on public.enrollments for insert
  with check (
    public.is_course_instructor(course_id)
    or public.get_my_role() = 'admin'
  );

create policy "enrollments: instructor, owner, or admin delete"
  on public.enrollments for delete
  using (
    user_id = auth.uid()
    or public.is_course_instructor(course_id)
    or public.get_my_role() = 'admin'
  );

-- ---- RPC: look up a user ID by email ---------------------------
-- security definer = runs as postgres owner, can read auth.users.
-- Caller must be instructor or admin (checked inside the function).

create or replace function public.get_user_id_by_email(p_email text)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  v_user_id uuid;
begin
  if public.get_my_role() not in ('instructor', 'admin') then
    raise exception 'Unauthorized';
  end if;

  select id into v_user_id
  from auth.users
  where lower(email) = lower(p_email);

  return v_user_id;
end;
$$;
