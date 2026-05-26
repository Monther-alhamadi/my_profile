-- ============================================================
-- CMS Write Policies for Authenticated Users
-- Allows dashboard admin to perform CRUD on all portfolio tables
-- ============================================================

-- ── Profile ──
CREATE POLICY "Authenticated users can update profile"
  ON profile FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can insert profile"
  ON profile FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- ── Projects ──
CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── Skills ──
CREATE POLICY "Authenticated users can insert skills"
  ON skills FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update skills"
  ON skills FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete skills"
  ON skills FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── Services ──
CREATE POLICY "Authenticated users can insert services"
  ON services FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update services"
  ON services FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete services"
  ON services FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── Experience ──
CREATE POLICY "Authenticated users can insert experience"
  ON experience FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update experience"
  ON experience FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete experience"
  ON experience FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── Stats ──
CREATE POLICY "Authenticated users can insert stats"
  ON stats FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update stats"
  ON stats FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete stats"
  ON stats FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── Testimonials ──
CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials FOR UPDATE
  USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials FOR DELETE
  USING (auth.role() = 'authenticated');

-- ── Contact Messages (add delete) ──
CREATE POLICY "Authenticated users can delete contact_messages"
  ON contact_messages FOR DELETE
  USING (auth.role() = 'authenticated');
