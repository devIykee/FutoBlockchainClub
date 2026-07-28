-- Public media bucket for team photos (and future assets).
-- Uploads go through the admin API with the service role key.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'media',
  'media',
  true,
  2097152, -- 2 MiB
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

-- Anyone can read public media objects
drop policy if exists "Public read media" on storage.objects;
create policy "Public read media"
  on storage.objects
  for select
  to public
  using (bucket_id = 'media');

-- Writes only via service role (bypasses RLS). No anon/authenticated insert/update/delete.
