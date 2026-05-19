create policy "notifications: delete own"
  on public.notifications for delete
  using (user_id = auth.uid());
