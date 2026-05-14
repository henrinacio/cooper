-- ============================================================
-- LMS Schema
-- ============================================================

-- ---- TYPES -------------------------------------------------

create type public.user_role as enum ('student', 'instructor', 'admin');
create type public.lesson_type as enum ('video', 'text', 'quiz');

-- ---- PROFILES ----------------------------------------------
-- One row per auth.users entry. Role defaults to student.

create table public.profiles (
  id          uuid primary key references auth.users (id) on delete cascade,
  full_name   text,
  avatar_url  text,
  role        public.user_role not null default 'student',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Auto-create profile on sign-up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- ---- COURSES -----------------------------------------------

create table public.courses (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique,
  title         text not null,
  description   text,
  thumbnail_url text,
  instructor_id uuid not null references public.profiles (id) on delete restrict,
  published     boolean not null default false,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index courses_instructor_id_idx on public.courses (instructor_id);
create index courses_published_idx on public.courses (published);

create trigger courses_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- ---- MODULES -----------------------------------------------

create table public.modules (
  id         uuid primary key default gen_random_uuid(),
  course_id  uuid not null references public.courses (id) on delete cascade,
  title      text not null,
  "order"    integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index modules_course_id_idx on public.modules (course_id);

create trigger modules_updated_at
  before update on public.modules
  for each row execute function public.set_updated_at();

-- ---- LESSONS -----------------------------------------------

create table public.lessons (
  id          uuid primary key default gen_random_uuid(),
  module_id   uuid not null references public.modules (id) on delete cascade,
  title       text not null,
  type        public.lesson_type not null default 'text',
  content     text,
  video_url   text,
  duration_s  integer,
  "order"     integer not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index lessons_module_id_idx on public.lessons (module_id);

create trigger lessons_updated_at
  before update on public.lessons
  for each row execute function public.set_updated_at();

-- ---- ENROLLMENTS -------------------------------------------

create table public.enrollments (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles (id) on delete cascade,
  course_id   uuid not null references public.courses (id) on delete cascade,
  enrolled_at timestamptz not null default now(),
  unique (user_id, course_id)
);

create index enrollments_user_id_idx on public.enrollments (user_id);
create index enrollments_course_id_idx on public.enrollments (course_id);

-- ---- PROGRESS ----------------------------------------------

create table public.progress (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles (id) on delete cascade,
  lesson_id    uuid not null references public.lessons (id) on delete cascade,
  completed_at timestamptz not null default now(),
  unique (user_id, lesson_id)
);

create index progress_user_id_idx on public.progress (user_id);
create index progress_lesson_id_idx on public.progress (lesson_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles   enable row level security;
alter table public.courses    enable row level security;
alter table public.modules    enable row level security;
alter table public.lessons    enable row level security;
alter table public.enrollments enable row level security;
alter table public.progress   enable row level security;

-- ---- helpers -----------------------------------------------

create or replace function public.get_my_role()
returns public.user_role language sql stable security definer set search_path = ''
as $$
  select role from public.profiles where id = auth.uid();
$$;

create or replace function public.is_course_instructor(p_course_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.courses
    where id = p_course_id and instructor_id = auth.uid()
  );
$$;

create or replace function public.is_enrolled(p_course_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.enrollments
    where course_id = p_course_id and user_id = auth.uid()
  );
$$;

-- ---- profiles policies -------------------------------------

create policy "profiles: public read"
  on public.profiles for select
  using (true);

create policy "profiles: owner update"
  on public.profiles for update
  using (id = auth.uid())
  with check (id = auth.uid());

-- ---- courses policies --------------------------------------

create policy "courses: anyone reads published"
  on public.courses for select
  using (published = true or instructor_id = auth.uid() or public.get_my_role() = 'admin');

create policy "courses: instructor insert"
  on public.courses for insert
  with check (
    instructor_id = auth.uid()
    and public.get_my_role() in ('instructor', 'admin')
  );

create policy "courses: instructor update"
  on public.courses for update
  using (instructor_id = auth.uid() or public.get_my_role() = 'admin')
  with check (instructor_id = auth.uid() or public.get_my_role() = 'admin');

create policy "courses: instructor delete"
  on public.courses for delete
  using (instructor_id = auth.uid() or public.get_my_role() = 'admin');

-- ---- modules policies --------------------------------------

create policy "modules: read if course visible"
  on public.modules for select
  using (
    exists (
      select 1 from public.courses c
      where c.id = course_id
        and (c.published = true or c.instructor_id = auth.uid() or public.get_my_role() = 'admin')
    )
  );

create policy "modules: instructor write"
  on public.modules for insert
  with check (public.is_course_instructor(course_id) or public.get_my_role() = 'admin');

create policy "modules: instructor update"
  on public.modules for update
  using (public.is_course_instructor(course_id) or public.get_my_role() = 'admin');

create policy "modules: instructor delete"
  on public.modules for delete
  using (public.is_course_instructor(course_id) or public.get_my_role() = 'admin');

-- ---- lessons policies --------------------------------------

create policy "lessons: enrolled or instructor reads"
  on public.lessons for select
  using (
    exists (
      select 1 from public.modules m
      join public.courses c on c.id = m.course_id
      where m.id = module_id
        and (
          c.instructor_id = auth.uid()
          or public.get_my_role() = 'admin'
          or (c.published = true and public.is_enrolled(c.id))
        )
    )
  );

create policy "lessons: instructor write"
  on public.lessons for insert
  with check (
    exists (
      select 1 from public.modules m
      where m.id = module_id
        and (public.is_course_instructor(m.course_id) or public.get_my_role() = 'admin')
    )
  );

create policy "lessons: instructor update"
  on public.lessons for update
  using (
    exists (
      select 1 from public.modules m
      where m.id = module_id
        and (public.is_course_instructor(m.course_id) or public.get_my_role() = 'admin')
    )
  );

create policy "lessons: instructor delete"
  on public.lessons for delete
  using (
    exists (
      select 1 from public.modules m
      where m.id = module_id
        and (public.is_course_instructor(m.course_id) or public.get_my_role() = 'admin')
    )
  );

-- ---- enrollments policies ----------------------------------

create policy "enrollments: read own"
  on public.enrollments for select
  using (user_id = auth.uid() or public.get_my_role() = 'admin');

create policy "enrollments: self enroll"
  on public.enrollments for insert
  with check (user_id = auth.uid());

create policy "enrollments: self or admin delete"
  on public.enrollments for delete
  using (user_id = auth.uid() or public.get_my_role() = 'admin');

-- ---- progress policies -------------------------------------

create policy "progress: read own"
  on public.progress for select
  using (user_id = auth.uid() or public.get_my_role() = 'admin');

create policy "progress: insert own"
  on public.progress for insert
  with check (user_id = auth.uid());

create policy "progress: delete own"
  on public.progress for delete
  using (user_id = auth.uid());
