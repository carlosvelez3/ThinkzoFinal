import { getBrowserInfo } from '../utils/browserEnvironment';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
    recaptchaScriptLoaded?: boolean;
    recaptchaLoadError?: string | null;
  }
}

export interface RecaptchaTokenResult {
  success: boolean;
  token?: string;
  error?: string;
}

export const RECAPTCHA_ACTIONS = {
  VERIFY_IDENTITY: 'verify_identity',
  SUBMIT_CONTACT_FORM: 'submit_contact_form',
  SUBMIT_PROJECT: 'submit_project',
} as const;

const MAX_WAIT_ATTEMPTS = 40;
const WAIT_DELAY_MS = 300;

export class RecaptchaService {
  private static instance: RecaptchaService;
  private siteKey: string;

  private constructor() {
    this.siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || '';
  }

  public static getInstance(): RecaptchaService {
    if (!RecaptchaService.instance) {
      RecaptchaService.instance = new RecaptchaService();
    }
    return RecaptchaService.instance;
  }

  private async waitForRecaptcha(maxAttempts = MAX_WAIT_ATTEMPTS, delayMs = WAIT_DELAY_MS): Promise<{ success: boolean; error?: string }> {
    console.log('⏳ [RecaptchaService] Waiting for reCAPTCHA to load...');

    if (window.recaptchaLoadError) {
      console.error('❌ [RecaptchaService] reCAPTCHA load error detected:', window.recaptchaLoadError);
      return { success: false, error: window.recaptchaLoadError };
    }

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      if (window.recaptchaScriptLoaded && typeof window.grecaptcha !== 'undefined' && window.grecaptcha && window.grecaptcha.ready) {
        console.log(`✅ [RecaptchaService] reCAPTCHA loaded successfully after ${attempt + 1} attempts`);
        return { success: true };
      }

      if (window.recaptchaLoadError) {
        console.error('❌ [RecaptchaService] reCAPTCHA load error detected during wait:', window.recaptchaLoadError);
        return { success: false, error: window.recaptchaLoadError };
      }

      if (attempt % 5 === 0 && attempt > 0) {
        console.log(`⏳ [RecaptchaService] Still waiting for reCAPTCHA... (attempt ${attempt + 1}/${maxAttempts})`);
      }

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    console.error('❌ [RecaptchaService] reCAPTCHA failed to load after maximum attempts');
    return {
      success: false,
      error: 'reCAPTCHA script failed to load. Please refresh the page and try again.'
    };
  }

  public async executeRecaptcha(action: string): Promise<RecaptchaTokenResult> {
    try {
      console.log(`🔐 [RecaptchaService] Starting reCAPTCHA execution for action: ${action}`);

      if (!this.siteKey || this.siteKey.trim() === '') {
        console.error('❌ [RecaptchaService] Site key is not configured');
        return {
          success: false,
          error: 'reCAPTCHA configuration missing. Please contact support.'
        };
      }

      const recaptchaStatus = await this.waitForRecaptcha();

      if (!recaptchaStatus.success) {
        console.error('❌ [RecaptchaService] reCAPTCHA script not available:', recaptchaStatus.error);
        return {
          success: false,
          error: recaptchaStatus.error || 'reCAPTCHA failed to load. Please refresh the page and try again.'
        };
      }

      console.log(`✅ [RecaptchaService] reCAPTCHA ready, executing with action: ${action}`);

      return new Promise((resolve) => {
        window.grecaptcha.ready(async () => {
          try {
            const startTime = Date.now();
            const token = await window.grecaptcha.execute(this.siteKey, { action });
            const executionTime = Date.now() - startTime;

            console.log(`✅ [RecaptchaService] Token generated in ${executionTime}ms, length: ${token?.length || 0}`);

            if (!token || token.trim() === '') {
              console.error('❌ [RecaptchaService] Empty token received');
              resolve({
                success: false,
                error: 'Failed to generate verification token. Please try again.'
              });
              return;
            }

            resolve({
              success: true,
              token
            });
          } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error';
            console.error('❌ [RecaptchaService] Execution error:', errorMessage, err);

            if (errorMessage.includes('Invalid site key') || errorMessage.includes('Invalid domain')) {
              const currentDomain = window.location.hostname;
              resolve({
                success: false,
                error: `Domain authorization error. The current domain "${currentDomain}" is not authorized for this reCAPTCHA site key.`
              });
            } else if (errorMessage.includes('timeout')) {
              resolve({
                success: false,
                error: 'Verification timed out. Please check your internet connection and try again.'
              });
            } else {
              resolve({
                success: false,
                error: 'Browser verification failed. Please ensure cookies are enabled and try again.'
              });
            }
          }
        });
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [RecaptchaService] Unexpected error:', errorMessage, err);
      return {
        success: false,
        error: 'Verification failed. Please try again.'
      };
    }
  }

  public async verifyTokenWithBackend(token: string, action: string): Promise<any> {
    try {
      console.log(`🔍 [RecaptchaService] Verifying token with backend for action: ${action}`);
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('❌ [RecaptchaService] Supabase configuration missing');
        throw new Error('Service configuration error. Please contact support.');
      }

      const verifyUrl = `${supabaseUrl}/functions/v1/verify-recaptcha`;
      console.log('📡 [RecaptchaService] Verification endpoint:', verifyUrl);

      const browserInfo = getBrowserInfo();
      const startTime = Date.now();

      const response = await fetch(verifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${supabaseAnonKey}`,
          'X-Browser-Name': browserInfo.name,
          'X-Browser-Version': browserInfo.version,
        },
        body: JSON.stringify({ token, action }),
      });

      const responseTime = Date.now() - startTime;
      console.log(`📥 [RecaptchaService] Received response in ${responseTime}ms, status: ${response.status}`);

      const data = await response.json();
      console.log('📦 [RecaptchaService] Response data:', { success: data.success, score: data.score, error: data.error });

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Verification failed');
      }

      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error('❌ [RecaptchaService] Backend verification error:', errorMessage);
      throw err;
    }
  }

  public async executeAndVerify(action: string): Promise<{ success: boolean; data?: any; error?: string }> {
    const tokenResult = await this.executeRecaptcha(action);

    if (!tokenResult.success || !tokenResult.token) {
      return {
        success: false,
        error: tokenResult.error || 'Failed to generate verification token'
      };
    }

    try {
      const verificationData = await this.verifyTokenWithBackend(tokenResult.token, action);
      return {
        success: true,
        data: verificationData
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      return {
        success: false,
        error: errorMessage
      };
    }
  }
}

export const recaptchaService = RecaptchaService.getInstance();
