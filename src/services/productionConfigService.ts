/**
 * Production Configuration Service
 * Handles environment-specific configurations and hardening
 */

interface ProductionConfig {
  environment: 'development' | 'staging' | 'production';
  isDemoModeEnabled: boolean;
  enableDebugLogging: boolean;
  enableErrorReporting: boolean;
  enableAnalytics: boolean;
  apiTimeout: number;
  maxRetries: number;
}

class ProductionConfigService {
  private config: ProductionConfig;

  constructor() {
    this.config = this.initializeConfig();
    this.validateProduction();
  }

  private initializeConfig(): ProductionConfig {
    const isDev = import.meta.env.DEV;
    const isProd = import.meta.env.PROD;

    return {
      environment: isProd ? 'production' : isDev ? 'development' : 'staging',
      isDemoModeEnabled: !isProd, // Demo mode only in non-production
      enableDebugLogging: isDev,
      enableErrorReporting: !isDev,
      enableAnalytics: isProd,
      apiTimeout: isProd ? 30000 : 60000, // 30s in prod, 60s in dev
      maxRetries: isProd ? 3 : 5
    };
  }

  private validateProduction(): void {
    if (this.config.environment !== 'production') {
      return;
    }

    // Validate production requirements
    const requiredEnvVars = [
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY'
    ];

    const missing = requiredEnvVars.filter(
      varName => !import.meta.env[varName as keyof ImportMetaEnv]
    );

    if (missing.length > 0) {
      console.error('❌ Missing production environment variables:', missing);
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    console.log('✅ Production environment validation passed');
  }

  getConfig(): ProductionConfig {
    return { ...this.config };
  }

  isDemoModeActive(): boolean {
    return this.config.isDemoModeEnabled;
  }

  isProduction(): boolean {
    return this.config.environment === 'production';
  }

  isDevelopment(): boolean {
    return this.config.environment === 'development';
  }

  isStaging(): boolean {
    return this.config.environment === 'staging';
  }

  /**
   * Log safely - respects environment settings
   */
  log(message: string, data?: any): void {
    if (this.config.enableDebugLogging) {
      console.log(`[${new Date().toISOString()}] ${message}`, data || '');
    }
  }

  /**
   * Log error safely
   */
  error(message: string, error?: any): void {
    console.error(`[ERROR] ${message}`, error || '');

    // In production, could send to error tracking service
    if (this.config.enableErrorReporting && this.isProduction()) {
      this.reportError(message, error);
    }
  }

  /**
   * Sanitize user input to prevent XSS
   */
  sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';

    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate URL to prevent open redirect
   */
  isValidRedirectUrl(url: string): boolean {
    try {
      const parsed = new URL(url, window.location.origin);
      const origin = window.location.origin;

      // Only allow same-origin redirects
      return parsed.origin === origin;
    } catch {
      return false;
    }
  }

  /**
   * Report error to monitoring service
   */
  private reportError(message: string, error?: any): void {
    try {
      // Example: Could integrate with Sentry, LogRocket, etc.
      const errorData = {
        message,
        error: error?.message || 'Unknown error',
        stack: error?.stack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href
      };

      console.log('📊 Error reported for analytics:', errorData);

      // Uncomment when integrating actual error tracking service
      // fetch('/api/errors', {
      //   method: 'POST',
      //   body: JSON.stringify(errorData)
      // }).catch(err => console.error('Failed to report error:', err));
    } catch (err) {
      console.error('Failed to report error:', err);
    }
  }

  /**
   * Get security headers recommendations
   */
  getSecurityHeaders(): Record<string, string> {
    return {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'SAMEORIGIN',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };
  }

  /**
   * Get CSP (Content Security Policy) header
   */
  getCSPHeader(): string {
    return `
      default-src 'self';
      script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self' data:;
      connect-src 'self' https://api.supabase.co;
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim();
  }
}

// Export singleton instance
export const productionConfigService = new ProductionConfigService();
export default productionConfigService;
