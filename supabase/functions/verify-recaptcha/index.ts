import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface RecaptchaRequest {
  token: string;
}

interface GoogleRecaptchaEnterpriseResponse {
  tokenProperties?: {
    valid: boolean;
    hostname?: string;
    action?: string;
    createTime?: string;
    invalidReason?: string;
  };
  riskAnalysis?: {
    score?: number;
    reasons?: string[];
  };
  event?: {
    token?: string;
    siteKey?: string;
    userAgent?: string;
    userIpAddress?: string;
    expectedAction?: string;
  };
  name?: string;
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
}

interface RateLimitResult {
  allowed: boolean;
  reason?: string;
  blocked_until?: string;
  attempts_remaining: number;
  reset_at?: string;
}

async function verifyRecaptchaWithGoogle(
  token: string,
  remoteIp?: string
): Promise<GoogleRecaptchaEnterpriseResponse> {
  const apiKey = Deno.env.get("RECAPTCHA_ENTERPRISE_API_KEY");
  const projectId = Deno.env.get("RECAPTCHA_ENTERPRISE_PROJECT_ID");

  if (!apiKey) {
    throw new Error("RECAPTCHA_ENTERPRISE_API_KEY not configured");
  }

  if (!projectId) {
    throw new Error("RECAPTCHA_ENTERPRISE_PROJECT_ID not configured");
  }

  const verifyUrl = `https://recaptchaenterprise.googleapis.com/v1/projects/${projectId}/assessments?key=${apiKey}`;

  const requestBody: any = {
    event: {
      token: token,
      siteKey: Deno.env.get("RECAPTCHA_SITE_KEY"),
      expectedAction: "verify_identity"
    }
  };

  if (remoteIp) {
    requestBody.event.userIpAddress = remoteIp;
  }

  const response = await fetch(verifyUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Google reCAPTCHA Enterprise API error: ${response.status} - ${JSON.stringify(errorData)}`);
  }

  return await response.json();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const ipAddress =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const rateLimitResult = await supabase.rpc("check_captcha_rate_limit", {
      p_ip_address: ipAddress,
    });

    if (rateLimitResult.error) {
      console.error("Rate limit check error:", rateLimitResult.error);
      return new Response(
        JSON.stringify({ error: "Rate limit check failed" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const rateLimitData = rateLimitResult.data as RateLimitResult;

    if (!rateLimitData.allowed) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "rate_limit_exceeded",
          message: "Too many verification attempts. Please try again later.",
          blocked_until: rateLimitData.blocked_until,
          attempts_remaining: 0,
        }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const requestData: RecaptchaRequest = await req.json();

    if (!requestData.token) {
      return new Response(
        JSON.stringify({ error: "Missing reCAPTCHA token" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const googleResult = await verifyRecaptchaWithGoogle(
      requestData.token,
      ipAddress
    );

    const isTokenValid = googleResult.tokenProperties?.valid === true;
    const score = googleResult.riskAnalysis?.score;
    const minimumScore = 0.5;
    const isScoreAcceptable = score !== undefined && score >= minimumScore;
    const verificationStatus = isTokenValid && isScoreAcceptable ? "verified" : "failed";

    const { data: verification, error: dbError } = await supabase
      .from("captcha_verifications")
      .insert({
        token: requestData.token,
        ip_address: ipAddress,
        user_agent: userAgent,
        verification_status: verificationStatus,
        score: score || null,
        challenge_ts: googleResult.tokenProperties?.createTime || null,
        hostname: googleResult.tokenProperties?.hostname || null,
        error_codes: googleResult.tokenProperties?.invalidReason
          ? JSON.stringify([googleResult.tokenProperties.invalidReason])
          : (googleResult.riskAnalysis?.reasons ? JSON.stringify(googleResult.riskAnalysis.reasons) : null),
        verified_at: isTokenValid && isScoreAcceptable ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
    }

    if (!isTokenValid) {
      const errorMessage =
        googleResult.tokenProperties?.invalidReason ||
        googleResult.error?.message ||
        "reCAPTCHA Enterprise verification failed";

      return new Response(
        JSON.stringify({
          success: false,
          error: "verification_failed",
          message: `Verification failed: ${errorMessage}`,
          error_codes: googleResult.tokenProperties?.invalidReason ? [googleResult.tokenProperties.invalidReason] : [],
          score: score,
          attempts_remaining: rateLimitData.attempts_remaining - 1,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!isScoreAcceptable) {
      console.log("reCAPTCHA Enterprise score too low", {
        ip: ipAddress,
        score: score,
        minimum_required: minimumScore,
        reasons: googleResult.riskAnalysis?.reasons,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: "score_too_low",
          message: "Verification score is too low. This request appears suspicious.",
          score: score,
          reasons: googleResult.riskAnalysis?.reasons,
          attempts_remaining: rateLimitData.attempts_remaining - 1,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("reCAPTCHA Enterprise verification successful", {
      ip: ipAddress,
      hostname: googleResult.tokenProperties?.hostname,
      score: score,
      action: googleResult.tokenProperties?.action,
      verification_id: verification?.id,
      assessment_name: googleResult.name,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification successful",
        verification_id: verification?.id,
        score: score,
        hostname: googleResult.tokenProperties?.hostname,
        action: googleResult.tokenProperties?.action,
        assessment_name: googleResult.name,
        attempts_remaining: rateLimitData.attempts_remaining - 1,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({
        error: "internal_server_error",
        message:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
