-- Create a storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio', 'portfolio', true);

-- Policy to allow authenticated users to upload images to 'portfolio' bucket
CREATE POLICY "Allow public read access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'portfolio' );

CREATE POLICY "Allow authenticated uploads"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'portfolio' );

CREATE POLICY "Allow owners to update their own images"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'portfolio' AND auth.uid() = owner );

CREATE POLICY "Allow owners to delete their own images"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'portfolio' AND auth.uid() = owner );
