import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// CORS headers for cross-origin requests
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

// Email service configuration (using Resend as example)
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || 'noreply@thinkzo.ai'
const COMPANY_NAME = 'Thinkzo.ai'

// Form submission interface
interface FormSubmission {
  name: string
  email: string
  phone?: string
  company?: string
  projectType?: string
  message: string
}

// Validation functions
function validateEmail(email: string): boolean {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/
  return emailRegex.test(email)
}

function validatePhone(phone: string): boolean {
  if (!phone) return true // Phone is optional
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .substring(0, 2000) // Limit length
}

function validateFormData(data: any): { isValid: boolean; errors: string[]; sanitized?: FormSubmission } {
  const errors: string[] = []
  
  // Check required fields
  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 2) {
    errors.push('Name is required and must be at least 2 characters')
  }
  
  if (!data.email || typeof data.email !== 'string' || !validateEmail(data.email)) {
    errors.push('Valid email address is required')
  }
  
  if (!data.message || typeof data.message !== 'string' || data.message.trim().length < 10) {
    errors.push('Message is required and must be at least 10 characters')
  }
  
  // Validate optional phone
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Invalid phone number format')
  }
  
  // Check length limits
  if (data.name && data.name.length > 100) {
    errors.push('Name must be less than 100 characters')
  }
  
  if (data.message && data.message.length > 2000) {
    errors.push('Message must be less than 2000 characters')
  }
  
  if (errors.length > 0) {
    return { isValid: false, errors }
  }
  
  // Return sanitized data
  const sanitized: FormSubmission = {
    name: sanitizeInput(data.name),
    email: data.email.toLowerCase().trim(),
    phone: data.phone ? sanitizeInput(data.phone) : undefined,
    company: data.company ? sanitizeInput(data.company) : undefined,
    projectType: data.projectType ? sanitizeInput(data.projectType) : undefined,
    message: sanitizeInput(data.message)
  }
  
  return { isValid: true, errors: [], sanitized }
}

// Email template
function generateEmailTemplate(name: string, submissionId: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thank You - ${COMPANY_NAME}</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f8f9fa; }
        .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #06B6D4 0%, #6366F1 100%); color: white; padding: 40px 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 40px 30px; }
        .content h2 { color: #1f2937; margin-top: 0; font-size: 24px; }
        .content p { margin-bottom: 20px; font-size: 16px; }
        .highlight-box { background: #f0f9ff; border-left: 4px solid #06B6D4; padding: 20px; margin: 30px 0; border-radius: 4px; }
        .contact-info { background: #f8fafc; padding: 25px; border-radius: 8px; margin: 30px 0; }
        .contact-info h3 { margin-top: 0; color: #374151; font-size: 18px; }
        .footer { background: #1f2937; color: #9ca3af; padding: 30px; text-align: center; font-size: 14px; }
        .footer a { color: #06B6D4; text-decoration: none; }
        .button { display: inline-block; background: linear-gradient(135deg, #06B6D4, #6366F1); color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin: 20px 0; }
        @media (max-width: 600px) { .container { margin: 0; border-radius: 0; } .header, .content, .contact-info { padding: 20px; } }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${COMPANY_NAME}</h1>
            <p style="margin: 10px 0 0 0; opacity: 0.9; font-size: 18px;">AI-Powered Web Development</p>
        </div>
        
        <div class="content">
            <h2>Thank You, ${name}!</h2>
            
            <p>We've successfully received your project inquiry and are excited about the opportunity to work with you.</p>
            
            <div class="highlight-box">
                <p><strong>What happens next?</strong></p>
                <ul style="margin: 10px 0; padding-left: 20px;">
                    <li>Our team will review your project requirements within 2 hours</li>
                    <li>A project specialist will contact you within 24 hours</li>
                    <li>We'll schedule a discovery call to discuss your vision</li>
                    <li>You'll receive a detailed proposal within 48 hours</li>
                </ul>
            </div>
            
            <p>In the meantime, feel free to explore our portfolio and learn more about our AI-powered development process.</p>
            
            <div class="contact-info">
                <h3>Contact Information</h3>
                <p><strong>Email:</strong> <a href="mailto:team@thinkzo.ai">team@thinkzo.ai</a></p>
                <p><strong>Response Time:</strong> Within 24 hours</p>
                <p><strong>Submission ID:</strong> ${submissionId}</p>
            </div>
            
            <p>Thank you for choosing ${COMPANY_NAME} for your web development needs. We look forward to bringing your vision to life!</p>
        </div>
        
        <div class="footer">
            <p>&copy; 2024 ${COMPANY_NAME}. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you have questions, contact us at <a href="mailto:team@thinkzo.ai">team@thinkzo.ai</a></p>
        </div>
    </div>
</body>
</html>
  `
}

// Send email using Resend API
async function sendConfirmationEmail(email: string, name: string, submissionId: string): Promise<{ success: boolean; error?: string }> {
  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured')
    return { success: false, error: 'Email service not configured' }
  }
  
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${COMPANY_NAME} <${FROM_EMAIL}>`,
        to: [email],
        subject: `Thank you for your inquiry - ${COMPANY_NAME}`,
        html: generateEmailTemplate(name, submissionId),
      }),
    })
    
    if (!response.ok) {
      const errorData = await response.text()
      console.error('Email sending failed:', errorData)
      return { success: false, error: `Email service error: ${response.status}` }
    }
    
    const result = await response.json()
    console.log('Email sent successfully:', result.id)
    return { success: true }
    
  } catch (error) {
    console.error('Email sending error:', error)
    return { success: false, error: error.message }
  }
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { 
        status: 405, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
  
  try {
    // Parse request body
    const requestData = await req.json()
    
    // Validate form data
    const validation = validateFormData(requestData)
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ 
          error: 'Validation failed', 
          details: validation.errors 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)
    
    // Insert form submission into database
    const { data: submission, error: dbError } = await supabase
      .from('form_submissions')
      .insert([{
        name: validation.sanitized!.name,
        email: validation.sanitized!.email,
        phone: validation.sanitized!.phone,
        company: validation.sanitized!.company,
        project_type: validation.sanitized!.projectType,
        message: validation.sanitized!.message,
      }])
      .select('id')
      .single()
    
    if (dbError) {
      console.error('Database error:', dbError)
      return new Response(
        JSON.stringify({ error: 'Failed to save submission' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }
    
    // Send confirmation email
    const emailResult = await sendConfirmationEmail(
      validation.sanitized!.email,
      validation.sanitized!.name,
      submission.id
    )
    
    // Update email status in database
    const emailStatus = emailResult.success ? 'sent' : 'failed'
    const emailError = emailResult.success ? null : emailResult.error
    
    await supabase
      .from('form_submissions')
      .update({ 
        email_sent_status: emailStatus,
        email_error_log: emailError
      })
      .eq('id', submission.id)
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Form submitted successfully',
        submissionId: submission.id,
        emailSent: emailResult.success
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
    
  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})