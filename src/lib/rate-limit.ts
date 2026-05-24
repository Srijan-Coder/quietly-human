type RateLimitRecord = {
  count: number;
  resetTime: number;
};

class MemoryRateLimiter {
  private store = new Map<string, RateLimitRecord>();

  /**
   * Check if a request is allowed based on the IP or identifier.
   * @param id Identifier (e.g., IP address or User ID)
   * @param limit Maximum number of requests allowed
   * @param windowMs Time window in milliseconds
   * @returns An object containing success boolean and remaining requests
   */
  check(id: string, limit: number, windowMs: number): { success: boolean; remaining: number } {
    const now = Date.now();
    const record = this.store.get(id);

    if (!record || now > record.resetTime) {
      // Create new record or reset expired record
      this.store.set(id, {
        count: 1,
        resetTime: now + windowMs,
      });
      return { success: true, remaining: limit - 1 };
    }

    if (record.count >= limit) {
      return { success: false, remaining: 0 };
    }

    // Increment count
    record.count += 1;
    this.store.set(id, record);
    return { success: true, remaining: limit - record.count };
  }
}

export const rateLimiter = new MemoryRateLimiter();
