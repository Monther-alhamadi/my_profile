-- Run this in Supabase SQL Editor
-- Allows authenticated users to read contact_messages

CREATE POLICY "Authenticated users can read contact_messages"
ON contact_messages FOR SELECT
USING (auth.role() = 'authenticated');

-- Also allow authenticated users to update is_read
CREATE POLICY "Authenticated users can update contact_messages"
ON contact_messages FOR UPDATE
USING (auth.role() = 'authenticated')
WITH CHECK (auth.role() = 'authenticated');
