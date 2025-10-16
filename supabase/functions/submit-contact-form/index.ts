import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ProjectDetails {
  projectGoals: string;
  targetAudience: string;
  selectedFeatures: string[];
  timeline: string;
  budgetRange: string;
  additionalNotes: string;
  templateUsed?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType: string;
  message?: string;
  projectDetails?: ProjectDetails;
}

async function sendEmailViaResend(
  to: string[],
  subject: string,
  html: string,
  replyTo?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    const fromEmail = Deno.env.get('FROM_EMAIL') || 'team@thinkzo.ai';
    const fromName = Deno.env.get('FROM_NAME') || 'Thinkzo.ai';

    if (!resendApiKey) {
      console.error('RESEND_API_KEY not configured');
      return { success: false, error: 'Resend API key not configured' };
    }

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${fromName} <${fromEmail}>`,
        to: to,
        subject: subject,
        html: html,
        reply_to: replyTo || fromEmail,
      }),
    });

    const responseData = await response.json();

    if (!response.ok) {
      console.error('Resend API error:', responseData);
      return {
        success: false,
        error: responseData.message || `Resend API error: ${response.status}`
      };
    }

    console.log(`Email sent successfully via Resend to: ${to.join(', ')}`, {
      emailId: responseData.id,
    });

    return { success: true };
  } catch (error) {
    console.error('Resend email error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        {
          status: 405,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    const formData: ContactFormData = await req.json();

    if (!formData.name || !formData.email || !formData.projectType) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    if (!formData.message && !formData.projectDetails) {
      return new Response(
        JSON.stringify({ error: 'Either message or projectDetails is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

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

    const ipAddress = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const projectDetails = formData.projectDetails;
    const legacyMessage = formData.message || (projectDetails ?
      `Goals: ${projectDetails.projectGoals}\n\nFeatures: ${projectDetails.selectedFeatures.join(', ')}\n\nTimeline: ${projectDetails.timeline}\n\nBudget: ${projectDetails.budgetRange}${projectDetails.targetAudience ? `\n\nTarget Audience: ${projectDetails.targetAudience}` : ''}${projectDetails.additionalNotes ? `\n\nAdditional Notes: ${projectDetails.additionalNotes}` : ''}`
      : '');

    const { data: submission, error: dbError } = await supabase
      .from('contact_submissions')
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        company: formData.company || null,
        project_type: formData.projectType,
        message: legacyMessage,
        project_goals: projectDetails?.projectGoals || null,
        target_audience: projectDetails?.targetAudience || null,
        selected_features: projectDetails?.selectedFeatures || [],
        timeline_preference: projectDetails?.timeline || null,
        budget_range: projectDetails?.budgetRange || null,
        additional_notes: projectDetails?.additionalNotes || null,
        template_used: projectDetails?.templateUsed || null,
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

    console.log('Contact form submission saved:', {
      id: submission.id,
      email: formData.email,
      projectType: formData.projectType,
      timestamp: new Date().toISOString(),
    });

    const responsePromise = new Response(
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

    Promise.resolve().then(async () => {
      try {
      const teamEmailHtml = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #06b6d4;">New Project Inquiry</h2>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
            ${formData.company ? `<p><strong>Company:</strong> ${formData.company}</p>` : ''}
            <p><strong>Project Type:</strong> ${formData.projectType}</p>
          </div>
          ${projectDetails ? `
          <div style="background: #fff; padding: 20px; border-left: 4px solid #06b6d4; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #0c4a6e;">Project Details:</h3>

            <div style="margin: 15px 0;">
              <h4 style="color: #0891b2; margin-bottom: 8px;">Project Goals:</h4>
              <p style="margin: 0; color: #334155;">${projectDetails.projectGoals}</p>
            </div>

            ${projectDetails.targetAudience ? `
            <div style="margin: 15px 0;">
              <h4 style="color: #0891b2; margin-bottom: 8px;">Target Audience:</h4>
              <p style="margin: 0; color: #334155;">${projectDetails.targetAudience}</p>
            </div>
            ` : ''}

            <div style="margin: 15px 0;">
              <h4 style="color: #0891b2; margin-bottom: 8px;">Selected Features:</h4>
              <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                ${projectDetails.selectedFeatures.map(f => `<span style="background: #e0f2fe; color: #0c4a6e; padding: 4px 12px; border-radius: 12px; font-size: 14px;">${f}</span>`).join('')}
              </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 15px 0;">
              <div>
                <h4 style="color: #0891b2; margin-bottom: 8px;">Timeline:</h4>
                <p style="margin: 0; color: #334155;">${projectDetails.timeline}</p>
              </div>
              <div>
                <h4 style="color: #0891b2; margin-bottom: 8px;">Budget Range:</h4>
                <p style="margin: 0; color: #334155;">${projectDetails.budgetRange}</p>
              </div>
            </div>

            ${projectDetails.additionalNotes ? `
            <div style="margin: 15px 0;">
              <h4 style="color: #0891b2; margin-bottom: 8px;">Additional Notes:</h4>
              <p style="margin: 0; color: #334155; white-space: pre-wrap;">${projectDetails.additionalNotes}</p>
            </div>
            ` : ''}

            ${projectDetails.templateUsed ? `
            <div style="margin: 15px 0; padding: 10px; background: #f1f5f9; border-radius: 6px;">
              <p style="margin: 0; font-size: 13px; color: #64748b;"><strong>Template Used:</strong> ${projectDetails.templateUsed}</p>
            </div>
            ` : ''}
          </div>
          ` : `
          <div style="background: #fff; padding: 20px; border-left: 4px solid #06b6d4;">
            <h3 style="margin-top: 0;">Message:</h3>
            <p style="white-space: pre-wrap;">${legacyMessage}</p>
          </div>
          `}
          <div style="margin-top: 20px; padding: 15px; background: #e0f2fe; border-radius: 8px;">
            <p style="margin: 0; font-size: 12px; color: #0c4a6e;">
              <strong>Metadata:</strong><br>
              IP: ${ipAddress}<br>
              Submission ID: ${submission.id}<br>
              Timestamp: ${new Date().toISOString()}
            </p>
          </div>
        </div>
      `;

      const teamEmailResult = await sendEmailViaResend(
        ['team@thinkzo.ai'],
        `New Project Inquiry: ${formData.projectType}`,
        teamEmailHtml,
        formData.email
      );

      if (!teamEmailResult.success) {
        console.error('Team notification email failed:', teamEmailResult.error);
      } else {
        console.log('Team notification email sent successfully');
      }

      const confirmationEmailHtml = `
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
                  <tr>
                    <td style="padding: 40px;">
                      <p style="margin: 0 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                        Thank you for reaching out to Thinkzo.ai! We're excited to learn about your project and explore how we can help bring your vision to life.
                      </p>
                      <p style="margin: 0 0 30px; color: #334155; font-size: 16px; line-height: 1.6;">
                        A member of our team will personally reach out to you within the next <strong>24 hours</strong> to discuss your project in detail.
                      </p>
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
                      <div style="background: #e0f2fe; border-left: 4px solid #06b6d4; border-radius: 4px; padding: 20px; margin: 30px 0;">
                        <h3 style="margin: 0 0 12px; color: #0c4a6e; font-size: 16px; font-weight: 600;">
                          What Happens Next?
                        </h3>
                        <p style="margin: 0; padding-left: 0; color: #0c4a6e; line-height: 1.6;">
                          A team member will contact you directly via email within 24 hours to discuss your project requirements and answer any questions you may have.
                        </p>
                      </div>
                      <p style="margin: 30px 0 20px; color: #334155; font-size: 16px; line-height: 1.6;">
                        Please keep an eye on your inbox for our email. If you have any urgent questions in the meantime, feel free to reach out to us at <a href="mailto:team@thinkzo.ai" style="color: #06b6d4; text-decoration: none;">team@thinkzo.ai</a>.
                      </p>
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
                        This is an automated confirmation. A team member will follow up with you personally within 24 hours.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `;

      const confirmationEmailResult = await sendEmailViaResend(
        [formData.email],
        'Thank You for Your Project Inquiry - Thinkzo.ai',
        confirmationEmailHtml,
        'team@thinkzo.ai'
      );

        if (!confirmationEmailResult.success) {
          console.error('User confirmation email failed:', confirmationEmailResult.error);
        } else {
          console.log('User confirmation email sent successfully');
        }
      } catch (emailError) {
        console.error('Error sending emails in background:', emailError);
      }
    }).catch(err => {
      console.error('Background email task failed:', err);
    });

    return responsePromise;
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