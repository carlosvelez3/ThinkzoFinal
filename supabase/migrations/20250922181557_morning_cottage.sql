/*
  # Create form submissions table

  1. New Tables
    - `form_submissions`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `email` (text, required)
      - `phone` (text, optional)
      - `company` (text, optional)
      - `project_type` (text, optional)
      - `message` (text, required)
      - `submitted_at` (timestamp)
      - `email_sent_status` (text)
      - `email_error_log` (text, optional)

  2. Security
    - Enable RLS on `form_submissions` table
    - Add policy for service role access only
*/

CREATE TABLE IF NOT EXISTS form_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  project_type text,
  message text NOT NULL,
  submitted_at timestamptz DEFAULT now(),
  email_sent_status text DEFAULT 'pending' CHECK (email_sent_status IN ('pending', 'sent', 'failed')),
  email_error_log text,
  
  -- Add constraints for data validation
  CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  CONSTRAINT valid_name_length CHECK (char_length(name) >= 2 AND char_length(name) <= 100),
  CONSTRAINT valid_message_length CHECK (char_length(message) >= 10 AND char_length(message) <= 2000)
);

-- Enable Row Level Security
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;

-- Create policy for service role access (backend only)
CREATE POLICY "Service role can manage form submissions"
  ON form_submissions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_form_submissions_submitted_at ON form_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_email_status ON form_submissions(email_sent_status);