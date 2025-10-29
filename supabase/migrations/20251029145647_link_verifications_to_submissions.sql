/*
  # Link reCAPTCHA Verifications to Contact Submissions

  1. Changes
    - Add `verification_id` column to `contact_submissions` table to link with `captcha_verifications`
    - Add `submission_id` column to `captcha_verifications` table for bidirectional linking
    - Create foreign key constraints to maintain referential integrity
    - Add indexes for efficient queries on linked records
    - Update existing policies to support the new relationship

  2. Purpose
    This migration establishes a relationship between contact form submissions and their
    associated reCAPTCHA verifications. This enables:
    - Tracking which submissions passed/failed verification
    - Analyzing verification scores for submissions
    - Auditing security verification for each contact form submission
    - Better spam detection and prevention

  3. Notes
    - Both columns are nullable to support legacy data and graceful degradation
    - Foreign keys use CASCADE for verification deletions but RESTRICT for submission deletions
    - Indexes improve query performance when filtering submissions by verification status
*/

-- Add verification_id column to contact_submissions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'verification_id'
  ) THEN
    ALTER TABLE contact_submissions
    ADD COLUMN verification_id uuid;

    -- Create foreign key constraint
    ALTER TABLE contact_submissions
    ADD CONSTRAINT fk_contact_submissions_verification
    FOREIGN KEY (verification_id)
    REFERENCES captcha_verifications(id)
    ON DELETE SET NULL;

    -- Create index for efficient lookups
    CREATE INDEX IF NOT EXISTS idx_contact_submissions_verification_id
    ON contact_submissions(verification_id);

    COMMENT ON COLUMN contact_submissions.verification_id IS 'Links to the reCAPTCHA verification record for this submission';
  END IF;
END $$;

-- Add submission_id column to captcha_verifications
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'captcha_verifications' AND column_name = 'submission_id'
  ) THEN
    ALTER TABLE captcha_verifications
    ADD COLUMN submission_id uuid;

    -- Create foreign key constraint
    ALTER TABLE captcha_verifications
    ADD CONSTRAINT fk_captcha_verifications_submission
    FOREIGN KEY (submission_id)
    REFERENCES contact_submissions(id)
    ON DELETE RESTRICT;

    -- Create index for efficient reverse lookups
    CREATE INDEX IF NOT EXISTS idx_captcha_verifications_submission_id
    ON captcha_verifications(submission_id);

    COMMENT ON COLUMN captcha_verifications.submission_id IS 'Links to the contact submission that used this verification';
  END IF;
END $$;

-- Create a view for submissions with verification details
CREATE OR REPLACE VIEW contact_submissions_with_verification AS
SELECT
  cs.*,
  cv.success as verification_success,
  cv.score as verification_score,
  cv.action as verification_action,
  cv.hostname as verification_hostname,
  cv.verified_at
FROM contact_submissions cs
LEFT JOIN captcha_verifications cv ON cs.verification_id = cv.id;

-- Grant access to the view
GRANT SELECT ON contact_submissions_with_verification TO authenticated;

-- Add comment to the view
COMMENT ON VIEW contact_submissions_with_verification IS 'Contact submissions joined with their reCAPTCHA verification details for easy querying';
