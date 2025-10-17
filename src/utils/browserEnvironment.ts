export interface BrowserEnvironmentCheck {
  cookiesEnabled: boolean;
  localStorageEnabled: boolean;
  sessionStorageEnabled: boolean;
  thirdPartyCookiesEnabled: boolean;
  javascriptEnabled: boolean;
  userAgent: string;
  isPrivateMode: boolean;
  hasAdBlocker: boolean;
  isRestrictedEnvironment: boolean;
  environmentType: 'normal' | 'iframe' | 'sandboxed' | 'bolt' | 'unknown';
}

export interface BrowserEnvironmentResult {
  compatible: boolean;
  checks: BrowserEnvironmentCheck;
  issues: string[];
  warnings: string[];
}

async function checkThirdPartyCookies(): Promise<boolean> {
  try {
    const testUrl = 'https://www.google.com/recaptcha/api.js';
    const response = await fetch(testUrl, {
      method: 'HEAD',
      mode: 'no-cors',
      credentials: 'include',
    });
    return true;
  } catch {
    return false;
  }
}

function detectEnvironmentType(): { type: 'normal' | 'iframe' | 'sandboxed' | 'bolt' | 'unknown'; isRestricted: boolean } {
  try {
    const isInIframe = window.self !== window.top;
    const isSandboxed = window.location.protocol === 'null' ||
                        (window.frameElement && (window.frameElement as HTMLIFrameElement).hasAttribute('sandbox'));

    const isBoltEnvironment = window.location.hostname.includes('bolt.new') ||
                              window.location.hostname.includes('stackblitz') ||
                              window.location.hostname.includes('webcontainer') ||
                              (window as any).__BOLT_ENV__ === true;

    if (isBoltEnvironment) {
      console.log('🔧 Detected Bolt/development environment');
      return { type: 'bolt', isRestricted: true };
    }

    if (isSandboxed) {
      console.log('🔒 Detected sandboxed iframe environment');
      return { type: 'sandboxed', isRestricted: true };
    }

    if (isInIframe) {
      console.log('🖼️ Detected iframe environment');
      return { type: 'iframe', isRestricted: true };
    }

    return { type: 'normal', isRestricted: false };
  } catch (error) {
    console.warn('⚠️ Error detecting environment type:', error);
    return { type: 'unknown', isRestricted: true };
  }
}

async function checkCookiesEnabledEnhanced(): Promise<boolean> {
  console.log('🍪 Starting enhanced cookie detection...');

  const testCookieName = 'cookietest';
  const testValue = '1';

  const attemptCookieTest = (sameSite: string, secure: boolean = false, delay: number = 0): Promise<boolean> => {
    return new Promise((resolve) => {
      try {
        const secureFlag = secure ? '; Secure' : '';
        const cookieString = `${testCookieName}=${testValue}; SameSite=${sameSite}${secureFlag}; path=/`;

        document.cookie = cookieString;

        setTimeout(() => {
          const cookiesEnabled = document.cookie.indexOf(`${testCookieName}=`) !== -1;
          document.cookie = `${testCookieName}=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/`;
          resolve(cookiesEnabled);
        }, delay);
      } catch (error) {
        console.warn(`⚠️ Cookie test failed (SameSite=${sameSite}, Secure=${secure}):`, error);
        resolve(false);
      }
    });
  };

  console.log('🧪 Stage 1: Testing with SameSite=Lax and 50ms delay');
  let cookiesEnabled = await attemptCookieTest('Lax', false, 50);

  if (cookiesEnabled) {
    console.log('✅ Stage 1: Cookies enabled (SameSite=Lax)');
    return true;
  }

  console.log('🧪 Stage 2: Testing with SameSite=None and Secure flag');
  if (window.location.protocol === 'https:') {
    cookiesEnabled = await attemptCookieTest('None', true, 50);

    if (cookiesEnabled) {
      console.log('✅ Stage 2: Cookies enabled (SameSite=None; Secure)');
      return true;
    }
  }

  console.log('🧪 Stage 3: Testing with SameSite=Strict');
  cookiesEnabled = await attemptCookieTest('Strict', false, 50);

  if (cookiesEnabled) {
    console.log('✅ Stage 3: Cookies enabled (SameSite=Strict)');
    return true;
  }

  console.log('🧪 Stage 4: Testing with increased delay (200ms)');
  cookiesEnabled = await attemptCookieTest('Lax', false, 200);

  if (cookiesEnabled) {
    console.log('✅ Stage 4: Cookies enabled (with increased delay)');
    return true;
  }

  console.log('❌ All cookie detection stages failed');
  return false;
}

function checkLocalStorageEnabled(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function checkSessionStorageEnabled(): boolean {
  try {
    const testKey = '__test__';
    sessionStorage.setItem(testKey, 'test');
    sessionStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

async function checkPrivateMode(): Promise<boolean> {
  try {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const { usage, quota } = await navigator.storage.estimate();
      if (quota && quota < 120000000) {
        return true;
      }
    }

    const fs = (window as any).webkitRequestFileSystem || (window as any).requestFileSystem;
    if (fs) {
      return new Promise((resolve) => {
        fs(0, 0, () => resolve(false), () => resolve(true));
      });
    }

    return false;
  } catch {
    return false;
  }
}

function detectAdBlocker(): Promise<boolean> {
  return new Promise((resolve) => {
    const testAd = document.createElement('div');
    testAd.innerHTML = '&nbsp;';
    testAd.className = 'adsbox ad-placement carbon-ads';
    testAd.style.position = 'absolute';
    testAd.style.left = '-999px';
    testAd.style.top = '-999px';
    document.body.appendChild(testAd);

    setTimeout(() => {
      const detected = testAd.offsetHeight === 0 || testAd.clientHeight === 0;
      document.body.removeChild(testAd);
      resolve(detected);
    }, 100);
  });
}

export async function checkBrowserEnvironment(): Promise<BrowserEnvironmentResult> {
  const issues: string[] = [];
  const warnings: string[] = [];

  console.log('🔍 Starting comprehensive browser environment check...');

  const environment = detectEnvironmentType();
  const cookiesEnabled = await checkCookiesEnabledEnhanced();
  const localStorageEnabled = checkLocalStorageEnabled();
  const sessionStorageEnabled = checkSessionStorageEnabled();
  const thirdPartyCookiesEnabled = await checkThirdPartyCookies();
  const isPrivateMode = await checkPrivateMode();
  const hasAdBlocker = await detectAdBlocker();

  const checks: BrowserEnvironmentCheck = {
    cookiesEnabled,
    localStorageEnabled,
    sessionStorageEnabled,
    thirdPartyCookiesEnabled,
    javascriptEnabled: true,
    userAgent: navigator.userAgent,
    isPrivateMode,
    hasAdBlocker,
    isRestrictedEnvironment: environment.isRestricted,
    environmentType: environment.type,
  };

  if (!cookiesEnabled) {
    if (environment.isRestricted) {
      if (environment.type === 'bolt') {
        console.warn('⚠️ Cookie test failed in Bolt environment - this is expected and will not block functionality');
        warnings.push('Cookie detection inconclusive in development environment. Functionality may still work correctly.');
      } else if (environment.type === 'sandboxed' || environment.type === 'iframe') {
        console.warn('⚠️ Cookie test failed in restricted environment (iframe/sandbox)');
        warnings.push('Limited cookie access detected due to environment restrictions. Some features may have reduced functionality.');
      } else {
        console.warn('⚠️ Cookie test failed in unknown restricted environment');
        warnings.push('Cookie access may be restricted. If you experience issues, please check your browser settings.');
      }
    } else {
      console.error('❌ Cookies are disabled in normal environment');
      issues.push('Cookies are disabled. Please enable cookies in your browser settings.');
    }
  }

  if (!localStorageEnabled) {
    warnings.push('Local storage is disabled. Some features may not work properly.');
  }

  if (!sessionStorageEnabled) {
    warnings.push('Session storage is disabled. Some features may not work properly.');
  }

  if (hasAdBlocker) {
    warnings.push('Ad blocker detected. This may interfere with security verification. Please disable ad blockers for this site.');
  }

  if (isPrivateMode) {
    warnings.push('Private browsing mode detected. Some security features may not work properly.');
  }

  if (!thirdPartyCookiesEnabled) {
    warnings.push('Third-party cookies may be blocked. This can affect security verification.');
  }

  const compatible = issues.length === 0;

  console.log(`✅ Browser environment check complete: ${compatible ? 'Compatible' : 'Issues detected'}`);

  return {
    compatible,
    checks,
    issues,
    warnings,
  };
}

export function getBrowserInfo() {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let browserVersion = 'Unknown';

  if (ua.indexOf('Firefox') > -1) {
    browserName = 'Firefox';
    browserVersion = ua.match(/Firefox\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
    browserName = 'Opera';
    browserVersion = ua.match(/(?:Opera|OPR)\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Edg') > -1) {
    browserName = 'Edge';
    browserVersion = ua.match(/Edg\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Chrome') > -1) {
    browserName = 'Chrome';
    browserVersion = ua.match(/Chrome\/([0-9.]+)/)?.[1] || 'Unknown';
  } else if (ua.indexOf('Safari') > -1) {
    browserName = 'Safari';
    browserVersion = ua.match(/Version\/([0-9.]+)/)?.[1] || 'Unknown';
  }

  return {
    name: browserName,
    version: browserVersion,
    userAgent: ua,
    platform: navigator.platform,
    language: navigator.language,
  };
}

export function logBrowserEnvironment(result: BrowserEnvironmentResult) {
  const browserInfo = getBrowserInfo();

  console.group('🔍 Browser Environment Check');
  console.log('Browser:', `${browserInfo.name} ${browserInfo.version}`);
  console.log('Platform:', browserInfo.platform);
  console.log('Language:', browserInfo.language);
  console.log('Environment Type:', result.checks.environmentType);
  console.log('Restricted Environment:', result.checks.isRestrictedEnvironment ? '⚠️ Yes' : '✅ No');
  console.log('Cookies Enabled:', result.checks.cookiesEnabled ? '✅' : '❌');
  console.log('Local Storage:', result.checks.localStorageEnabled ? '✅' : '⚠️');
  console.log('Session Storage:', result.checks.sessionStorageEnabled ? '✅' : '⚠️');
  console.log('Third-Party Cookies:', result.checks.thirdPartyCookiesEnabled ? '✅' : '⚠️');
  console.log('Private Mode:', result.checks.isPrivateMode ? '⚠️ Yes' : '✅ No');
  console.log('Ad Blocker:', result.checks.hasAdBlocker ? '⚠️ Detected' : '✅ None');

  if (result.issues.length > 0) {
    console.group('❌ Critical Issues:');
    result.issues.forEach(issue => console.error(issue));
    console.groupEnd();
  }

  if (result.warnings.length > 0) {
    console.group('⚠️ Warnings:');
    result.warnings.forEach(warning => console.warn(warning));
    console.groupEnd();
  }

  console.log('Compatible:', result.compatible ? '✅' : '❌');
  console.groupEnd();
}
