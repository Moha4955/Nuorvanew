interface RateLimitRecord {
  count: number;
  resetTime: number;
}

class RateLimitService {
  private limits: Map<string, RateLimitRecord> = new Map();

  /**
   * Check if a request should be allowed based on rate limiting
   * @param key Unique identifier (e.g., user ID + action)
   * @param maxRequests Maximum requests allowed
   * @param windowMs Time window in milliseconds
   * @returns true if request is allowed, false if rate limit exceeded
   */
  isAllowed(key: string, maxRequests: number = 5, windowMs: number = 60000): boolean {
    const now = Date.now();
    const record = this.limits.get(key);

    // First request or window expired
    if (!record || now >= record.resetTime) {
      this.limits.set(key, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    // Within window, check limit
    if (record.count < maxRequests) {
      record.count++;
      return true;
    }

    return false;
  }

  /**
   * Get remaining requests in current window
   */
  getRemaining(key: string, maxRequests: number = 5, windowMs: number = 60000): number {
    const now = Date.now();
    const record = this.limits.get(key);

    if (!record || now >= record.resetTime) {
      return maxRequests;
    }

    return Math.max(0, maxRequests - record.count);
  }

  /**
   * Get time until rate limit resets (in seconds)
   */
  getResetTime(key: string): number {
    const record = this.limits.get(key);
    if (!record) return 0;

    const now = Date.now();
    const remaining = record.resetTime - now;
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
  }

  /**
   * Reset rate limit for a key
   */
  reset(key: string): void {
    this.limits.delete(key);
  }

  /**
   * Reset all rate limits
   */
  resetAll(): void {
    this.limits.clear();
  }

  /**
   * Cleanup expired records periodically
   */
  cleanup(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];

    this.limits.forEach((record, key) => {
      if (now >= record.resetTime) {
        keysToDelete.push(key);
      }
    });

    keysToDelete.forEach(key => this.limits.delete(key));
  }
}

// Common rate limit configurations
export const RATE_LIMITS = {
  // Authentication
  LOGIN: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 attempts per 15 minutes
  REGISTER: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour
  FORGOT_PASSWORD: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 attempts per hour

  // API Operations
  API_READ: { maxRequests: 100, windowMs: 60 * 1000 }, // 100 reads per minute
  API_WRITE: { maxRequests: 20, windowMs: 60 * 1000 }, // 20 writes per minute
  API_DELETE: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 deletes per hour

  // File Upload
  FILE_UPLOAD: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 uploads per hour
  FILE_DOWNLOAD: { maxRequests: 50, windowMs: 60 * 60 * 1000 }, // 50 downloads per hour

  // Messages
  SEND_MESSAGE: { maxRequests: 30, windowMs: 60 * 1000 }, // 30 messages per minute
  SEND_EMAIL: { maxRequests: 10, windowMs: 60 * 60 * 1000 }, // 10 emails per hour

  // Admin Operations
  BULK_ACTION: { maxRequests: 5, windowMs: 60 * 1000 }, // 5 bulk actions per minute
  REPORT_GENERATION: { maxRequests: 10, windowMs: 60 * 60 * 1000 } // 10 reports per hour
};

// Create singleton instance
export const rateLimitService = new RateLimitService();

// Run cleanup every 5 minutes
setInterval(() => {
  rateLimitService.cleanup();
}, 5 * 60 * 1000);

export default rateLimitService;
