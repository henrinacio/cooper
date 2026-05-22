-- Bump courses.updated_at when a module is inserted, updated, or deleted.
create or replace function public.touch_course_on_module_change()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  target_course_id uuid;
begin
  if TG_OP = 'DELETE' then
    target_course_id := OLD.course_id;
  else
    target_course_id := NEW.course_id;
  end if;

  update public.courses
  set updated_at = now()
  where id = target_course_id;

  return null;
end;
$$;

create trigger modules_touch_course
  after insert or update or delete on public.modules
  for each row execute function public.touch_course_on_module_change();

-- Bump courses.updated_at when a lesson is inserted, updated, or deleted.
-- Lessons don't have course_id directly, so join through modules.
create or replace function public.touch_course_on_lesson_change()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  target_module_id uuid;
begin
  if TG_OP = 'DELETE' then
    target_module_id := OLD.module_id;
  else
    target_module_id := NEW.module_id;
  end if;

  update public.courses
  set updated_at = now()
  where id = (
    select course_id from public.modules where id = target_module_id
  );

  return null;
end;
$$;

create trigger lessons_touch_course
  after insert or update or delete on public.lessons
  for each row execute function public.touch_course_on_lesson_change();
