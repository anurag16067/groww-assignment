import createApiClient, { retryRequest, cachedRequest } from './apiClient';

/**
 * Finnhub API Service
 * Documentation: https://finnhub.io/docs/api
 */

const BASE_URL = 'https://finnhub.io/api/v1';
const API_KEY = import.meta.env.VITE_FINNHUB_API_KEY;

// Create API client with Finnhub token in headers
const finnhubClient = createApiClient(BASE_URL);

/**
 * Get real-time quote data
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Quote data
 */
export const getQuote = async (symbol) => {
  const cacheKey = `fh_quote_${symbol}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/quote', {
          params: {
            symbol,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    60000 // 1 minute cache
  );
};

/**
 * Get company profile
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Company profile
 */
export const getCompanyProfile = async (symbol) => {
  const cacheKey = `fh_profile_${symbol}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/stock/profile2', {
          params: {
            symbol,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    86400000 // 24 hour cache
  );
};

/**
 * Get candles (OHLC) data
 * @param {string} symbol - Stock symbol
 * @param {string} resolution - Time resolution (1, 5, 15, 30, 60, D, W, M)
 * @param {number} from - Unix timestamp
 * @param {number} to - Unix timestamp
 * @returns {Promise<Object>} Candle data
 */
export const getCandles = async (symbol, resolution = 'D', from, to) => {
  const cacheKey = `fh_candles_${symbol}_${resolution}_${from}_${to}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/stock/candle', {
          params: {
            symbol,
            resolution,
            from,
            to,
            token: API_KEY,
          },
        })
      );

      if (response.data.s === 'no_data') {
        throw new Error(`No candle data found for ${symbol}`);
      }

      return response.data;
    },
    300000 // 5 minute cache
  );
};

/**
 * Get market news
 * @param {string} category - News category (general, forex, crypto, merger)
 * @returns {Promise<Array>} News articles
 */
export const getMarketNews = async (category = 'general') => {
  const cacheKey = `fh_news_${category}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/news', {
          params: {
            category,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    300000 // 5 minute cache
  );
};

/**
 * Get company news
 * @param {string} symbol - Stock symbol
 * @param {string} from - Start date (YYYY-MM-DD)
 * @param {string} to - End date (YYYY-MM-DD)
 * @returns {Promise<Array>} News articles
 */
export const getCompanyNews = async (symbol, from, to) => {
  const cacheKey = `fh_company_news_${symbol}_${from}_${to}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/company-news', {
          params: {
            symbol,
            from,
            to,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    300000 // 5 minute cache
  );
};

/**
 * Search for symbols
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results
 */
export const searchSymbols = async (query) => {
  const cacheKey = `fh_search_${query}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/search', {
          params: {
            q: query,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    600000 // 10 minute cache
  );
};

/**
 * Get recommendation trends
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Array>} Recommendation data
 */
export const getRecommendationTrends = async (symbol) => {
  const cacheKey = `fh_recommendations_${symbol}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/stock/recommendation', {
          params: {
            symbol,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    86400000 // 24 hour cache
  );
};

/**
 * Get stock symbols by exchange
 * @param {string} exchange - Exchange code (US, TO, etc.)
 * @returns {Promise<Array>} List of symbols
 */
export const getStockSymbols = async (exchange = 'US') => {
  const cacheKey = `fh_symbols_${exchange}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/stock/symbol', {
          params: {
            exchange,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    86400000 // 24 hour cache
  );
};

/**
 * Get market status
 * @param {string} exchange - Exchange code
 * @returns {Promise<Object>} Market status
 */
export const getMarketStatus = async (exchange = 'US') => {
  const cacheKey = `fh_market_status_${exchange}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/stock/market-status', {
          params: {
            exchange,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    60000 // 1 minute cache
  );
};

/**
 * Get basic financials
 * @param {string} symbol - Stock symbol
 * @param {string} metric - Metric type (all, price, valuation, growth)
 * @returns {Promise<Object>} Financial metrics
 */
export const getBasicFinancials = async (symbol, metric = 'all') => {
  const cacheKey = `fh_financials_${symbol}_${metric}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        finnhubClient.get('/stock/metric', {
          params: {
            symbol,
            metric,
            token: API_KEY,
          },
        })
      );

      return response.data;
    },
    86400000 // 24 hour cache
  );
};

export default {
  getQuote,
  getCompanyProfile,
  getCandles,
  getMarketNews,
  getCompanyNews,
  searchSymbols,
  getRecommendationTrends,
  getStockSymbols,
  getMarketStatus,
  getBasicFinancials,
};
