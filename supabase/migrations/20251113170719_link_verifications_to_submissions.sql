/*
  # Link reCAPTCHA Verifications to Contact Submissions

  1. Changes
    - Add `verification_id` column to `contact_submissions` table to link with `captcha_verifications`
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
    - Column is nullable to support legacy data and graceful degradation
    - Foreign key uses SET NULL to avoid blocking deletions
    - Index improves query performance when filtering submissions by verification status
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