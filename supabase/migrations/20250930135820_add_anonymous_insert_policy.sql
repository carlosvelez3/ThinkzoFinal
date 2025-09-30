/*
  # Add anonymous insert policy for form submissions

  1. Changes
    - Add policy to allow anonymous users to insert form submissions
    - This enables the contact form to work without authentication
  
  2. Security
    - Anonymous users can only INSERT (not read, update, or delete)
    - All fields are validated on the frontend and backend
    - Email notifications are sent via service role
*/

-- Allow anonymous users to insert form submissions
CREATE POLICY "Anonymous users can submit contact forms"
  ON form_submissions
  FOR INSERT
  TO anon
  WITH CHECK (true);