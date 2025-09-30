/*
  # Add Public Form Submission Policy

  1. Changes
    - Add INSERT policy for anonymous and authenticated users on form_submissions table
    - Allows public contact form submissions without authentication
  
  2. Security
    - Anonymous users can only INSERT (submit forms)
    - Cannot read, update, or delete submissions
    - Restricts insert to reasonable field values
*/

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Anyone can submit contact forms" ON form_submissions;

-- Create policy to allow public form submissions
CREATE POLICY "Anyone can submit contact forms"
  ON form_submissions
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    -- Ensure required fields are present and reasonable
    name IS NOT NULL AND 
    length(name) > 0 AND 
    length(name) <= 100 AND
    email IS NOT NULL AND 
    length(email) > 0 AND 
    length(email) <= 255 AND
    message IS NOT NULL AND 
    length(message) > 0 AND 
    length(message) <= 2000
  );
