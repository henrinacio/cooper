export type UserRole = "student" | "instructor" | "admin";
export type LessonType = "video" | "text" | "quiz";

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  instructor_id: string;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  type: LessonType;
  content: string | null;
  video_url: string | null;
  duration_s: number | null;
  order: number;
  created_at: string;
  updated_at: string;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
}

export interface Progress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed_at: string;
}

export interface ScheduledSession {
  id: string;
  course_id: string;
  instructor_id: string;
  student_id: string;
  title: string;
  scheduled_at: string;
  duration_min: number;
  notes: string | null;
  confirmed: boolean;
  created_at: string;
}

export interface Notification {
  id: string;
  user_id: string;
  actor_id: string | null;
  type: string;
  metadata: Record<string, unknown>;
  read: boolean;
  created_at: string;
}

export type NotificationWithActor = Notification & {
  actor: { full_name: string | null; avatar_url: string | null } | null;
};

export type NotificationType = "class_scheduled" | "class_confirmed" | "class_cancelled" | "course_enrolled" | "course_completed";

export type ScheduledSessionWithDetails = ScheduledSession & {
  courses: { title: string } | null;
  student: { full_name: string | null } | null;
  instructor: { full_name: string | null } | null;
};

export type CourseWithStudents = Pick<Course, "id" | "title"> & {
  enrollments: Array<{
    user_id: string;
    profiles: { id: string; full_name: string | null } | null;
  }>;
};

// Joined types used across pages
export type CourseWithInstructor = Course & {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url">;
};

export type ModuleWithLessons = Module & {
  lessons: Lesson[];
};

export type CourseWithModules = Course & {
  modules: ModuleWithLessons[];
};

export type CourseWithModulesAndInstructor = CourseWithModules & {
  profiles: Pick<Profile, "id" | "full_name" | "avatar_url"> | null;
};

export type NoteTag = "academic" | "attendance" | "behavior" | "personal" | "milestone";

export interface StudentNote {
  id: string;
  instructor_id: string;
  student_id: string;
  course_id: string;
  content: string;
  tags: string[];
  pinned: boolean;
  session_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface StudentNoteHistory {
  id: string;
  note_id: string;
  content: string;
  edited_at: string;
}

export type StudentNoteWithCourse = StudentNote & {
  courses: Pick<Course, "id" | "title"> | null;
};
