import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  message: string;
}

Deno.serve(async (req: Request) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Parse request body
    const formData: ContactFormData = await req.json();

    // Validate required fields
    if (!formData.name || !formData.email || !formData.projectType || !formData.message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email format' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Get request metadata
    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Insert submission into database
    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        project_type: formData.projectType,
        message: formData.message,
        status: 'new',
        ip_address: ipAddress,
        user_agent: userAgent,
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Log successful submission
    console.log('Contact form submission saved:', {
      id: submission.id,
      email: formData.email,
      projectType: formData.projectType,
      timestamp: new Date().toISOString(),
    });

    // Send email notifications using Resend
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');

      if (resendApiKey) {
        // Send team notification email
        const teamEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Thinkzo.ai Contact Form <onboarding@resend.dev>',
            to: ['team@thinkzo.ai'],
            reply_to: formData.email,
            subject: `New Project Inquiry: ${formData.projectType}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #06b6d4;">New Project Inquiry</h2>
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <p><strong>Name:</strong> ${formData.name}</p>
                  <p><strong>Email:</strong> ${formData.email}</p>
                  ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
                  ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ''}
                  <p><strong>Project Type:</strong> ${formData.projectType}</p>
                </div>
                <div style="background: #fff; padding: 20px; border-left: 4px solid #06b6d4;">
                  <h3 style="margin-top: 0;">Message:</h3>
                  <p style="white-space: pre-wrap;">${formData.message}</p>
                </div>
                <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-radius: 8px;">
                  <p style="margin: 0; font-size: 12px; color: #0c4a6e;">
                    <strong>Metadata:</strong><br>
                    IP: ${ipAddress}<br>
                    Submission ID: ${submission.id}<br>
                    Timestamp: ${new Date().toISOString()}
                  </p>
                </div>
              </div>
            `,
          }),
        });

        if (!teamEmailResponse.ok) {
          const emailError = await teamEmailResponse.text();
          console.error('Team notification email failed:', emailError);
        } else {
          const teamEmailResult = await teamEmailResponse.json();
          console.log('Team notification email sent successfully:', teamEmailResult);
        }

        // Send confirmation email to the user
        const confirmationEmailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Thinkzo.ai <onboarding@resend.dev>',
            to: [formData.email],
            reply_to: 'team@thinkzo.ai',
            subject: 'Thank You for Your Project Inquiry - Thinkzo.ai',
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Thank You - Thinkzo.ai</title>
              </head>
              <body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fafc; padding: 40px 20px;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">

                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); padding: 40px 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: -0.5px;">
                              Thank You, ${formData.name.split(' ')[0]}!
                            </h1>
                            <p style="margin: 10px 0 0; color: #e0f2fe; font-size: 16px;">
                              We've received your project inquiry
                            </p>
                          </td>
                        </tr>

                        <!-- Main Content -->
                        <tr>
                          <td style="padding: 40px;">
                            <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                              Thank you for reaching out to Thinkzo.ai! We're excited to learn about your project and explore how we can help bring your vision to life.
                            </p>

                            <p style="margin: 0 0 30px; color: #334155; font-size: 16px; line-height: 1.6;">
                              Our team has received your inquiry and will review it carefully. You can expect to hear back from us within <strong>24-48 hours</strong>.
                            </p>

                            <!-- Submission Summary -->
                            <div style="background: #f1f5f9; border-radius: 8px; padding: 25px; margin: 30px 0;">
                              <h2 style="margin: 0 0 15px; color: #0f172a; font-size: 18px; font-weight: 600;">
                                Your Submission Summary
                              </h2>
                              <table width="100%" cellpadding="8" cellspacing="0">
                                <tr>
                                  <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Project Type:</td>
                                  <td style="color: #0f172a; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${formData.projectType}</td>
                                </tr>
                                ${formData.company ? `
                                <tr>
                                  <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Company:</td>
                                  <td style="color: #0f172a; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${formData.company}</td>
                                </tr>
                                ` : ''}
                                <tr>
                                  <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Reference ID:</td>
                                  <td style="color: #0f172a; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0; font-family: monospace;">${submission.id.substring(0, 8).toUpperCase()}</td>
                                </tr>
                                <tr>
                                  <td style="color: #64748b; font-size: 14px; padding: 8px 0;">Submitted:</td>
                                  <td style="color: #0f172a; font-size: 14px; font-weight: 600; text-align: right; padding: 8px 0;">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</td>
                                </tr>
                              </table>
                            </div>

                            <!-- Next Steps -->
                            <div style="background: #e0f2fe; border-left: 4px solid #06b6d4; border-radius: 4px; padding: 20px; margin: 30px 0;">
                              <h3 style="margin: 0 0 12px; color: #0c4a6e; font-size: 16px; font-weight: 600;">
                                What Happens Next?
                              </h3>
                              <ol style="margin: 0; padding-left: 20px; color: #0c4a6e;">
                                <li style="margin: 8px 0; line-height: 1.6;">Our team will review your project requirements</li>
                                <li style="margin: 8px 0; line-height: 1.6;">We'll reach out to schedule a discovery call</li>
                                <li style="margin: 8px 0; line-height: 1.6;">Together, we'll create a custom proposal for your project</li>
                              </ol>
                            </div>

                            <p style="margin: 30px 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                              In the meantime, feel free to explore our resources or reach out if you have any questions.
                            </p>

                            <!-- CTA Button -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                              <tr>
                                <td align="center">
                                  <a href="https://thinkzo.ai" style="display: inline-block; background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%); color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 6px; font-weight: 600; font-size: 16px;">
                                    Visit Our Website
                                  </a>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>

                        <!-- Footer -->
                        <tr>
                          <td style="background: #f8fafc; padding: 30px 40px; border-top: 1px solid #e2e8f0;">
                            <p style="margin: 0 0 10px; color: #64748b; font-size: 14px; text-align: center;">
                              <strong style="color: #0f172a;">Thinkzo.ai</strong><br>
                              Building intelligent solutions for tomorrow
                            </p>
                            <p style="margin: 15px 0 0; color: #94a3b8; font-size: 12px; text-align: center; line-height: 1.6;">
                              Questions? Reply to this email or contact us at <a href="mailto:team@thinkzo.ai" style="color: #06b6d4; text-decoration: none;">team@thinkzo.ai</a>
                            </p>
                            <p style="margin: 15px 0 0; color: #cbd5e1; font-size: 11px; text-align: center;">
                              This is an automated confirmation email. Please do not reply directly to this message.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `,
          }),
        });

        if (!confirmationEmailResponse.ok) {
          const confirmationError = await confirmationEmailResponse.text();
          console.error('User confirmation email failed:', confirmationError);
        } else {
          const confirmationResult = await confirmationEmailResponse.json();
          console.log('User confirmation email sent successfully:', confirmationResult);
        }
      } else {
        console.warn('RESEND_API_KEY not configured. Email notifications skipped.');
      }
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // Don't fail the request if email fails
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your inquiry has been submitted successfully!',
        submissionId: submission.id,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
