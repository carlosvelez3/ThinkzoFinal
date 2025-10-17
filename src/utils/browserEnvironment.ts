export interface BrowserEnvironmentCheck {
  cookiesEnabled: boolean;
  localStorageEnabled: boolean;
  sessionStorageEnabled: boolean;
  thirdPartyCookiesEnabled: boolean;
  javascriptEnabled: boolean;
  userAgent: string;
  isPrivateMode: boolean;
  hasAdBlocker: boolean;
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

function checkCookiesEnabled(): boolean {
  try {
    document.cookie = 'cookietest=1; SameSite=Lax';
    const cookiesEnabled = document.cookie.indexOf('cookietest=') !== -1;
    document.cookie = 'cookietest=1; expires=Thu, 01 Jan 1970 00:00:01 GMT';
    return cookiesEnabled;
  } catch {
    return false;
  }
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

  const cookiesEnabled = checkCookiesEnabled();
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
  };

  if (!cookiesEnabled) {
    issues.push('Cookies are disabled. Please enable cookies in your browser settings.');
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
