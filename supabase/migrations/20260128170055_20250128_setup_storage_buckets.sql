/*
  # Setup Supabase Storage Buckets

  1. New Buckets
    - `documents` - User documents, compliance files, invoices
    - `avatars` - User profile pictures
    - `forms` - Completed form PDFs

  2. Security
    - Enable RLS on all buckets
    - Users can upload own documents
    - Public read access for some files
    - Delete own files only
*/

-- Create documents bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('documents', 'documents', false)
ON CONFLICT (id) DO NOTHING;

-- Create avatars bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Create forms bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('forms', 'forms', false)
ON CONFLICT (id) DO NOTHING;

-- RLS Policy: Users can upload documents to their own folder
CREATE POLICY "Users can upload own documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can read their own documents
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Admins can read all documents
CREATE POLICY "Admins can read all documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'compliance', 'team_leader')
  )
);

-- RLS Policy: Users can upload avatars to their folder
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Public can read avatars
CREATE POLICY "Everyone can read avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');

-- RLS Policy: Users can delete their own avatars
CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can upload form PDFs
CREATE POLICY "Users can upload form PDFs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'forms'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Users can read their form PDFs
CREATE POLICY "Users can read own form PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'forms'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

-- RLS Policy: Admins can read all form PDFs
CREATE POLICY "Admins can read all form PDFs"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'forms'
  AND EXISTS (
    SELECT 1 FROM user_profiles
    WHERE id = auth.uid()
    AND role IN ('admin', 'compliance', 'team_leader')
  )
);
