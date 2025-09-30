import { Resend } from 'npm:resend@3.2.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const resend = new Resend(resendApiKey);
    const body = await req.json();
    const { name, email, phone, company, projectType, message, submissionId } = body;

    const fromEmail = Deno.env.get('RESEND_FROM_EMAIL') || 'onboarding@resend.dev';
    const toEmail = Deno.env.get('RESEND_TO_EMAIL') || 'delivered@resend.dev';

    const projectTypeLabels: { [key: string]: string } = {
      'landing-page': 'Landing Page',
      'business-website': 'Business Website',
      'ecommerce': 'E-commerce Store',
      'web-app': 'Web Application',
      'ai-integration': 'AI Integration',
      'other': 'Other/Custom'
    };

    const projectTypeLabel = projectTypeLabels[projectType] || projectType || 'General Inquiry';

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Project Inquiry</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">New Project Inquiry</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">Contact Information</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #555; width: 120px;">Name:</td>
                  <td style="padding: 8px 0; color: #333;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #555;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></td>
                </tr>
                ${phone ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #555;">Phone:</td>
                  <td style="padding: 8px 0; color: #333;">${phone}</td>
                </tr>
                ` : ''}
                ${company ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #555;">Company:</td>
                  <td style="padding: 8px 0; color: #333;">${company}</td>
                </tr>
                ` : ''}
              </table>
            </div>
            
            <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #ffc107;">
              <h2 style="color: #856404; margin-top: 0; font-size: 20px;">Project Type</h2>
              <p style="margin: 0; font-size: 18px; font-weight: 600; color: #333;">${projectTypeLabel}</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 20px; border-radius: 8px;">
              <h2 style="color: #667eea; margin-top: 0; font-size: 20px;">Project Details</h2>
              <p style="margin: 0; white-space: pre-wrap; color: #333; line-height: 1.8;">${message}</p>
            </div>
            
            <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e0e0e0; text-align: center;">
              <p style="color: #777; font-size: 14px; margin: 0;">
                Submission ID: <code style="background: #f0f0f0; padding: 2px 6px; border-radius: 3px;">${submissionId || 'N/A'}</code>
              </p>
            </div>
          </div>
          
          <div style="text-align: center; padding: 20px; color: #777; font-size: 12px;">
            <p>This email was sent from your website contact form.</p>
          </div>
        </body>
      </html>
    `;

    const emailData = await resend.emails.send({
      from: fromEmail,
      to: toEmail,
      replyTo: email,
      subject: `New Project Inquiry: ${projectTypeLabel} - ${name}`,
      html: emailHtml,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailId: emailData.id,
        message: 'Email sent successfully'
      }), 
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Email send error:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error.message || 'Failed to send email',
        details: error.toString()
      }), 
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
