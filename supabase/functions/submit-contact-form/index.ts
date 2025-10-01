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

    // Send email notification using Resend
    try {
      const resendApiKey = Deno.env.get('RESEND_API_KEY');

      if (resendApiKey) {
        const emailResponse = await fetch('https://api.resend.com/emails', {
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

        if (!emailResponse.ok) {
          const emailError = await emailResponse.text();
          console.error('Email send failed:', emailError);
        } else {
          const emailResult = await emailResponse.json();
          console.log('Email sent successfully:', emailResult);
        }
      } else {
        console.warn('RESEND_API_KEY not configured. Email notification skipped.');
      }
    } catch (emailError) {
      console.error('Error sending email:', emailError);
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