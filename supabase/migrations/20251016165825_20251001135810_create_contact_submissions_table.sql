/*
  # Create Contact Form Submissions Table

  1. New Tables
    - `contact_submissions`
      - `id` (uuid, primary key) - Unique identifier for each submission
      - `name` (text) - Contact's full name
      - `email` (text) - Contact's email address
      - `phone` (text, nullable) - Contact's phone number (optional)
      - `company` (text, nullable) - Contact's company name (optional)
      - `project_type` (text) - Type of project they're interested in
      - `message` (text) - Detailed project description
      - `status` (text) - Submission status (new, contacted, completed)
      - `created_at` (timestamptz) - When the submission was created
      - `updated_at` (timestamptz) - Last update timestamp
      - `ip_address` (text, nullable) - IP address of submitter for security
      - `user_agent` (text, nullable) - Browser user agent for analytics

  2. Security
    - Enable RLS on `contact_submissions` table
    - Add policy for anonymous users to insert submissions
    - Add policy for authenticated admin users to view all submissions

  3. Indexes
    - Index on email for quick lookups
    - Index on created_at for sorting
    - Index on status for filtering
*/

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  project_type text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'completed', 'spam')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  ip_address text,
  user_agent text
);

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous users to insert their own submissions
CREATE POLICY "Anyone can submit contact form"
  ON contact_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Policy: Allow authenticated users to view all submissions (for admin dashboard)
CREATE POLICY "Authenticated users can view all submissions"
  ON contact_submissions
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Allow authenticated users to update submissions (for status changes)
CREATE POLICY "Authenticated users can update submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on row updates
DROP TRIGGER IF EXISTS update_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();