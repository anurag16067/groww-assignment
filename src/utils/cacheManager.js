/**
 * CacheManager - Centralized cache with TTL and in-flight request deduplication
 * 
 * Features:
 * - Time-to-live (TTL) based expiration
 * - In-flight request tracking to prevent duplicate API calls
 * - Automatic cleanup of expired entries
 * - Memory management with max size limit
 */

class CacheManager {
  constructor(options = {}) {
    this.cache = new Map();
    this.inFlightRequests = new Map();
    this.maxSize = options.maxSize || 100;
    this.defaultTTL = options.defaultTTL || 5 * 60 * 1000; // 5 minutes
    this.cleanupInterval = options.cleanupInterval || 60 * 1000; // 1 minute
    
    // Start automatic cleanup
    this.startCleanup();
  }

  /**
   * Get cached data if valid
   * @param {string} key - Cache key
   * @returns {any|null} Cached data or null if expired/missing
   */
  get(key) {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // Check if expired
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  /**
   * Set data in cache with TTL
   * @param {string} key - Cache key
   * @param {any} data - Data to cache
   * @param {number} ttl - Time to live in milliseconds
   */
  set(key, data, ttl = this.defaultTTL) {
    // Enforce max size limit
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      // Remove oldest entry
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      expiresAt: Date.now() + ttl
    });
  }

  /**
   * Check if key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    const entry = this.cache.get(key);
    if (!entry) return false;
    
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Check if cache entry is expired
   * @param {object} entry - Cache entry
   * @returns {boolean}
   */
  isExpired(entry) {
    return Date.now() > entry.expiresAt;
  }

  /**
   * Get cache entry age in milliseconds
   * @param {string} key - Cache key
   * @returns {number|null} Age in ms or null if not found
   */
  getAge(key) {
    const entry = this.cache.get(key);
    if (!entry) return null;
    return Date.now() - entry.timestamp;
  }

  /**
   * Check if cache is stale (more than half TTL has passed)
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  isStale(key) {
    const entry = this.cache.get(key);
    if (!entry) return true;
    
    const age = this.getAge(key);
    return age > entry.ttl / 2;
  }

  /**
   * Delete specific key from cache
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear() {
    this.cache.clear();
    this.inFlightRequests.clear();
  }

  /**
   * Get or fetch data with deduplication
   * Prevents duplicate API calls for the same key
   * @param {string} key - Cache key
   * @param {Function} fetchFn - Async function to fetch data
   * @param {number} ttl - Time to live in milliseconds
   * @returns {Promise<any>}
   */
  async getOrFetch(key, fetchFn, ttl = this.defaultTTL) {
    // Check cache first
    const cached = this.get(key);
    if (cached !== null) {
      return cached;
    }

    // Check if there's already a request in flight for this key
    if (this.inFlightRequests.has(key)) {
      return this.inFlightRequests.get(key);
    }

    // Create new request
    const promise = fetchFn()
      .then(data => {
        this.set(key, data, ttl);
        this.inFlightRequests.delete(key);
        return data;
      })
      .catch(error => {
        this.inFlightRequests.delete(key);
        throw error;
      });

    // Store in-flight request
    this.inFlightRequests.set(key, promise);

    return promise;
  }

  /**
   * Start automatic cleanup of expired entries
   */
  startCleanup() {
    this.cleanupTimer = setInterval(() => {
      this.cleanup();
    }, this.cleanupInterval);
  }

  /**
   * Stop automatic cleanup
   */
  stopCleanup() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
      this.cleanupTimer = null;
    }
  }

  /**
   * Remove expired entries from cache
   */
  cleanup() {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   * @returns {object} Cache stats
   */
  getStats() {
    const entries = Array.from(this.cache.values());
    const expired = entries.filter(e => this.isExpired(e)).length;
    
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      expired,
      valid: this.cache.size - expired,
      inFlight: this.inFlightRequests.size
    };
  }

  /**
   * Invalidate cache entries matching a pattern
   * @param {RegExp|string} pattern - Pattern to match keys
   */
  invalidatePattern(pattern) {
    const regex = typeof pattern === 'string' 
      ? new RegExp(pattern) 
      : pattern;
    
    for (const key of this.cache.keys()) {
      if (regex.test(key)) {
        this.cache.delete(key);
      }
    }
  }
}

// Create singleton instance
const cacheManager = new CacheManager({
  maxSize: 200,
  defaultTTL: 5 * 60 * 1000, // 5 minutes
  cleanupInterval: 60 * 1000 // 1 minute
});

export default cacheManager;
export { CacheManager };
