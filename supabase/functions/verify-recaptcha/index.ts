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

interface GoogleRecaptchaResponse {
  success: boolean;
  challenge_ts?: string;
  hostname?: string;
  score?: number;
  action?: string;
  "error-codes"?: string[];
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
): Promise<GoogleRecaptchaResponse> {
  const secretKey = Deno.env.get("RECAPTCHA_SECRET_KEY");

  if (!secretKey) {
    console.error("RECAPTCHA_SECRET_KEY environment variable is not configured");
    throw new Error("RECAPTCHA_SECRET_KEY not configured");
  }

  const verifyUrl = "https://www.google.com/recaptcha/api/siteverify";
  const params = new URLSearchParams({
    secret: secretKey,
    response: token,
  });

  if (remoteIp) {
    params.append("remoteip", remoteIp);
  }

  console.log("Verifying reCAPTCHA token with Google API...");

  try {
    const response = await fetch(verifyUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: params.toString(),
    });

    if (!response.ok) {
      console.error(`Google reCAPTCHA API returned status: ${response.status}`);
      const errorText = await response.text();
      console.error("Google API error response:", errorText);
      throw new Error(`Google reCAPTCHA API error: ${response.status}`);
    }

    const result = await response.json();
    console.log("Google reCAPTCHA verification result:", {
      success: result.success,
      score: result.score,
      action: result.action,
      hostname: result.hostname,
      errorCodes: result["error-codes"]
    });

    return result;
  } catch (error) {
    console.error("Error calling Google reCAPTCHA API:", error);
    throw error;
  }
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
    const browserName = req.headers.get("x-browser-name") || "unknown";
    const browserVersion = req.headers.get("x-browser-version") || "unknown";

    console.log("Request details:", {
      ip: ipAddress,
      userAgent: userAgent.substring(0, 100),
      browser: `${browserName} ${browserVersion}`,
      method: req.method,
      timestamp: new Date().toISOString()
    });

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

    let requestData: RecaptchaRequest;
    try {
      requestData = await req.json();
    } catch (parseError) {
      console.error("Failed to parse request body:", parseError);
      return new Response(
        JSON.stringify({
          error: "Invalid request format",
          message: "Request body must be valid JSON"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!requestData.token) {
      console.error("Missing reCAPTCHA token in request");
      return new Response(
        JSON.stringify({
          error: "Missing reCAPTCHA token",
          message: "The reCAPTCHA token is required for verification"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (typeof requestData.token !== 'string' || requestData.token.trim() === '') {
      console.error("Invalid reCAPTCHA token format:", typeof requestData.token);
      return new Response(
        JSON.stringify({
          error: "Invalid token format",
          message: "The reCAPTCHA token must be a non-empty string"
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("Received verification request", {
      ip: ipAddress,
      tokenLength: requestData.token.length,
      userAgent: userAgent.substring(0, 50)
    });

    const googleResult = await verifyRecaptchaWithGoogle(
      requestData.token,
      ipAddress
    );

    const minimumScore = 0.5;
    const isScoreAcceptable = googleResult.score !== undefined && googleResult.score >= minimumScore;
    const verificationStatus = googleResult.success && isScoreAcceptable ? "verified" : "failed";

    const { data: verification, error: dbError } = await supabase
      .from("captcha_verifications")
      .insert({
        token: requestData.token,
        ip_address: ipAddress,
        user_agent: userAgent,
        verification_status: verificationStatus,
        score: googleResult.score || null,
        challenge_ts: googleResult.challenge_ts || null,
        hostname: googleResult.hostname || null,
        error_codes: googleResult["error-codes"]
          ? JSON.stringify(googleResult["error-codes"])
          : null,
        verified_at: googleResult.success && isScoreAcceptable ? new Date().toISOString() : null,
      })
      .select()
      .single();

    if (dbError) {
      console.error("Database error:", dbError);
    }

    if (!googleResult.success) {
      const errorCodes = googleResult["error-codes"] || [];
      let userMessage = "reCAPTCHA verification failed";
      let detailedReason = "";

      console.error("Google reCAPTCHA verification failed:", {
        errorCodes,
        ip: ipAddress,
        browser: `${browserName} ${browserVersion}`,
        userAgent: userAgent.substring(0, 100)
      });

      if (errorCodes.includes("browser-error")) {
        userMessage = "Browser environment issue detected. Please ensure cookies are enabled, disable ad blockers or privacy extensions, and try a different browser if the issue persists.";
        detailedReason = "Google detected browser environment restrictions or security features blocking verification. Common causes: strict privacy settings, third-party cookie blocking, ad blockers, or browser extensions interfering with reCAPTCHA.";
        console.warn("browser-error detected - likely privacy/security software interference");
      } else if (errorCodes.includes("timeout-or-duplicate")) {
        userMessage = "Verification token expired or already used. Please try again.";
        detailedReason = "Token was either used before or took too long to verify (tokens expire after 2 minutes).";
      } else if (errorCodes.includes("invalid-input-response")) {
        userMessage = "Invalid verification token. Please refresh the page and try again.";
        detailedReason = "The token format was invalid or corrupted during transmission.";
      } else if (errorCodes.includes("invalid-input-secret")) {
        userMessage = "Server configuration error. Please contact support.";
        detailedReason = "The reCAPTCHA secret key is misconfigured on the server.";
        console.error("CRITICAL: Invalid reCAPTCHA secret key configured");
      } else if (errorCodes.includes("missing-input-response")) {
        userMessage = "Verification token missing. Please try again.";
        detailedReason = "No token was provided in the request.";
      } else if (errorCodes.includes("missing-input-secret")) {
        userMessage = "Server configuration error. Please contact support.";
        detailedReason = "The reCAPTCHA secret key is not configured on the server.";
        console.error("CRITICAL: Missing reCAPTCHA secret key");
      } else if (errorCodes.length > 0) {
        userMessage = `Verification failed: ${errorCodes.join(", ")}`;
        detailedReason = `Unknown error codes: ${errorCodes.join(", ")}`;
      }

      console.log("Detailed failure reason:", detailedReason);

      return new Response(
        JSON.stringify({
          success: false,
          error: "verification_failed",
          message: userMessage,
          error_codes: errorCodes,
          detailed_reason: detailedReason,
          score: googleResult.score,
          attempts_remaining: rateLimitData.attempts_remaining - 1,
          browser_info: `${browserName} ${browserVersion}`,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    if (!isScoreAcceptable) {
      console.log("reCAPTCHA score too low", {
        ip: ipAddress,
        score: googleResult.score,
        minimum_required: minimumScore,
      });

      return new Response(
        JSON.stringify({
          success: false,
          error: "score_too_low",
          message: "Verification score is too low. This request appears suspicious.",
          score: googleResult.score,
          attempts_remaining: rateLimitData.attempts_remaining - 1,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    console.log("reCAPTCHA v3 verification successful", {
      ip: ipAddress,
      hostname: googleResult.hostname,
      score: googleResult.score,
      action: googleResult.action,
      verification_id: verification?.id,
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Verification successful",
        verification_id: verification?.id,
        score: googleResult.score,
        hostname: googleResult.hostname,
        action: googleResult.action,
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