/*
  # Create reCAPTCHA Verification Tables

  ## Purpose
  This migration creates the database schema for storing and managing Google reCAPTCHA
  verification tokens with comprehensive security and rate limiting features.

  ## New Tables

  ### 1. `captcha_verifications`
  Stores all reCAPTCHA verification attempts and their results.

  ### 2. `captcha_rate_limits`
  Tracks verification attempts per IP address for rate limiting.

  ## Security
  - Enable RLS on both tables
  - Add policies for service role and anon users

  ## Indexes
  - Indexes for performance optimization
*/

-- Create captcha_verifications table
CREATE TABLE IF NOT EXISTS captcha_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  token text UNIQUE NOT NULL,
  ip_address text,
  user_agent text,
  verification_status text DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'failed', 'expired')),
  score numeric CHECK (score >= 0 AND score <= 1),
  challenge_ts timestamptz,
  hostname text,
  error_codes jsonb,
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz DEFAULT (now() + interval '10 minutes'),
  verified_at timestamptz
);

-- Create captcha_rate_limits table
CREATE TABLE IF NOT EXISTS captcha_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ip_address text UNIQUE NOT NULL,
  attempt_count integer DEFAULT 1,
  first_attempt_at timestamptz DEFAULT now(),
  last_attempt_at timestamptz DEFAULT now(),
  is_blocked boolean DEFAULT false,
  blocked_until timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_captcha_verifications_token ON captcha_verifications(token);
CREATE INDEX IF NOT EXISTS idx_captcha_verifications_ip ON captcha_verifications(ip_address);
CREATE INDEX IF NOT EXISTS idx_captcha_verifications_expires ON captcha_verifications(expires_at);
CREATE INDEX IF NOT EXISTS idx_captcha_verifications_status ON captcha_verifications(verification_status);
CREATE INDEX IF NOT EXISTS idx_captcha_verifications_ip_created ON captcha_verifications(ip_address, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_captcha_rate_limits_ip ON captcha_rate_limits(ip_address);
CREATE INDEX IF NOT EXISTS idx_captcha_rate_limits_blocked ON captcha_rate_limits(is_blocked, blocked_until);

-- Enable Row Level Security
ALTER TABLE captcha_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE captcha_rate_limits ENABLE ROW LEVEL SECURITY;

-- Policies for captcha_verifications
CREATE POLICY "Anyone can create verification requests"
  ON captcha_verifications FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Service role can read all verifications"
  ON captcha_verifications FOR SELECT
  TO service_role
  USING (true);

CREATE POLICY "Service role can update verifications"
  ON captcha_verifications FOR UPDATE
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can delete verifications"
  ON captcha_verifications FOR DELETE
  TO service_role
  USING (true);

-- Policies for captcha_rate_limits
CREATE POLICY "Service role can manage rate limits"
  ON captcha_rate_limits FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_captcha_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM captcha_verifications
  WHERE expires_at < (now() - interval '24 hours');
END;
$$;

-- Function to check and update rate limits
CREATE OR REPLACE FUNCTION check_captcha_rate_limit(p_ip_address text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_record captcha_rate_limits%ROWTYPE;
  v_window_start timestamptz := now() - interval '15 minutes';
  v_max_attempts integer := 5;
  v_result jsonb;
BEGIN
  SELECT * INTO v_record
  FROM captcha_rate_limits
  WHERE ip_address = p_ip_address
  FOR UPDATE;

  IF NOT FOUND THEN
    INSERT INTO captcha_rate_limits (ip_address, attempt_count, first_attempt_at, last_attempt_at)
    VALUES (p_ip_address, 1, now(), now())
    RETURNING * INTO v_record;

    RETURN jsonb_build_object(
      'allowed', true,
      'attempts_remaining', v_max_attempts - 1,
      'reset_at', now() + interval '15 minutes'
    );
  END IF;

  IF v_record.is_blocked AND v_record.blocked_until > now() THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limit_exceeded',
      'blocked_until', v_record.blocked_until,
      'attempts_remaining', 0
    );
  END IF;

  IF v_record.is_blocked AND v_record.blocked_until <= now() THEN
    UPDATE captcha_rate_limits
    SET is_blocked = false,
        blocked_until = NULL,
        attempt_count = 1,
        first_attempt_at = now(),
        last_attempt_at = now(),
        updated_at = now()
    WHERE ip_address = p_ip_address;

    RETURN jsonb_build_object(
      'allowed', true,
      'attempts_remaining', v_max_attempts - 1,
      'reset_at', now() + interval '15 minutes'
    );
  END IF;

  IF v_record.first_attempt_at < v_window_start THEN
    UPDATE captcha_rate_limits
    SET attempt_count = 1,
        first_attempt_at = now(),
        last_attempt_at = now(),
        updated_at = now()
    WHERE ip_address = p_ip_address;

    RETURN jsonb_build_object(
      'allowed', true,
      'attempts_remaining', v_max_attempts - 1,
      'reset_at', now() + interval '15 minutes'
    );
  END IF;

  UPDATE captcha_rate_limits
  SET attempt_count = attempt_count + 1,
      last_attempt_at = now(),
      updated_at = now()
  WHERE ip_address = p_ip_address;

  IF v_record.attempt_count + 1 > v_max_attempts THEN
    UPDATE captcha_rate_limits
    SET is_blocked = true,
        blocked_until = now() + interval '1 hour',
        updated_at = now()
    WHERE ip_address = p_ip_address;

    RETURN jsonb_build_object(
      'allowed', false,
      'reason', 'rate_limit_exceeded',
      'blocked_until', now() + interval '1 hour',
      'attempts_remaining', 0
    );
  END IF;

  RETURN jsonb_build_object(
    'allowed', true,
    'attempts_remaining', v_max_attempts - (v_record.attempt_count + 1),
    'reset_at', v_record.first_attempt_at + interval '15 minutes'
  );
END;
$$;