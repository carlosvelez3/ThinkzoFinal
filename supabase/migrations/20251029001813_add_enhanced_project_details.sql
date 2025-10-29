/*
  # Add Enhanced Project Details to Contact Submissions

  ## Overview
  This migration adds new columns to the contact_submissions table to support
  the enhanced project details input that includes structured information about
  project goals, features, timeline, and budget.

  ## Changes

  1. New Columns
    - `project_goals` (text) - Detailed description of project goals and objectives
    - `target_audience` (text, nullable) - Information about the target audience
    - `selected_features` (jsonb) - Array of selected features for the project
    - `timeline_preference` (text, nullable) - Preferred timeline for project completion
    - `budget_range` (text, nullable) - Budget range for the project
    - `additional_notes` (text, nullable) - Any additional notes or requirements
    - `template_used` (text, nullable) - Which template was used (if any)

  2. Data Migration
    - Existing `message` field data is preserved for backward compatibility
    - New submissions will use the structured format

  3. Notes
    - The `message` field remains in the table for backward compatibility
    - New form submissions will populate both `message` (for email templates)
      and the new structured fields
    - The `selected_features` column uses JSONB for flexible storage of feature arrays
*/

-- Add new columns for enhanced project details
DO $$
BEGIN
  -- Add project_goals column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'project_goals'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN project_goals text;
  END IF;

  -- Add target_audience column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'target_audience'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN target_audience text;
  END IF;

  -- Add selected_features column (JSONB for array storage)
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'selected_features'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN selected_features jsonb DEFAULT '[]'::jsonb;
  END IF;

  -- Add timeline_preference column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'timeline_preference'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN timeline_preference text;
  END IF;

  -- Add budget_range column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'budget_range'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN budget_range text;
  END IF;

  -- Add additional_notes column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'additional_notes'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN additional_notes text;
  END IF;

  -- Add template_used column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'template_used'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN template_used text;
  END IF;
END $$;

-- Create index on selected_features for querying
CREATE INDEX IF NOT EXISTS idx_contact_submissions_selected_features
  ON contact_submissions USING gin(selected_features);

-- Create index on template_used for analytics
CREATE INDEX IF NOT EXISTS idx_contact_submissions_template_used
  ON contact_submissions(template_used);