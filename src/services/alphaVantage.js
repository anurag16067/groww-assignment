import createApiClient, { retryRequest, cachedRequest } from './apiClient';

/**
 * Alpha Vantage API Service
 * Documentation: https://www.alphavantage.co/documentation/
 */

const BASE_URL = 'https://www.alphavantage.co/query';
const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_API_KEY;

// Create API client
const alphaVantageClient = createApiClient(BASE_URL);

/**
 * Get quote data for a symbol
 * @param {string} symbol - Stock symbol (e.g., 'IBM')
 * @returns {Promise<Object>} Quote data
 */
export const getQuote = async (symbol) => {
  const cacheKey = `av_quote_${symbol}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        alphaVantageClient.get('', {
          params: {
            function: 'GLOBAL_QUOTE',
            symbol,
            apikey: API_KEY,
          },
        })
      );

      const data = response.data['Global Quote'];
      if (!data || Object.keys(data).length === 0) {
        throw new Error(`No data found for symbol: ${symbol}`);
      }

      return data;
    },
    60000 // 1 minute cache
  );
};

/**
 * Get intraday time series data
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval (1min, 5min, 15min, 30min, 60min)
 * @returns {Promise<Object>} Time series data
 */
export const getIntraday = async (symbol, interval = '5min') => {
  const cacheKey = `av_intraday_${symbol}_${interval}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        alphaVantageClient.get('', {
          params: {
            function: 'TIME_SERIES_INTRADAY',
            symbol,
            interval,
            apikey: API_KEY,
          },
        })
      );

      const timeSeriesKey = `Time Series (${interval})`;
      const data = response.data[timeSeriesKey];
      
      if (!data) {
        throw new Error(`No intraday data found for symbol: ${symbol}`);
      }

      return data;
    },
    300000 // 5 minute cache
  );
};

/**
 * Get daily time series data
 * @param {string} symbol - Stock symbol
 * @param {boolean} compact - If true, returns last 100 data points
 * @returns {Promise<Object>} Daily time series data
 */
export const getDailyTimeSeries = async (symbol, compact = true) => {
  const cacheKey = `av_daily_${symbol}_${compact}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        alphaVantageClient.get('', {
          params: {
            function: 'TIME_SERIES_DAILY',
            symbol,
            outputsize: compact ? 'compact' : 'full',
            apikey: API_KEY,
          },
        })
      );

      const data = response.data['Time Series (Daily)'];
      
      if (!data) {
        throw new Error(`No daily data found for symbol: ${symbol}`);
      }

      return data;
    },
    600000 // 10 minute cache
  );
};

/**
 * Get weekly time series data
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Weekly time series data
 */
export const getWeeklyTimeSeries = async (symbol) => {
  const cacheKey = `av_weekly_${symbol}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        alphaVantageClient.get('', {
          params: {
            function: 'TIME_SERIES_WEEKLY',
            symbol,
            apikey: API_KEY,
          },
        })
      );

      const data = response.data['Weekly Time Series'];
      
      if (!data) {
        throw new Error(`No weekly data found for symbol: ${symbol}`);
      }

      return data;
    },
    1800000 // 30 minute cache
  );
};

/**
 * Get monthly time series data
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Monthly time series data
 */
export const getMonthlyTimeSeries = async (symbol) => {
  const cacheKey = `av_monthly_${symbol}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        alphaVantageClient.get('', {
          params: {
            function: 'TIME_SERIES_MONTHLY',
            symbol,
            apikey: API_KEY,
          },
        })
      );

      const data = response.data['Monthly Time Series'];
      
      if (!data) {
        throw new Error(`No monthly data found for symbol: ${symbol}`);
      }

      return data;
    },
    3600000 // 1 hour cache
  );
};

/**
 * Search for symbols
 * @param {string} keywords - Search keywords
 * @returns {Promise<Array>} Array of matching symbols
 */
export const searchSymbols = async (keywords) => {
  const cacheKey = `av_search_${keywords}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        alphaVantageClient.get('', {
          params: {
            function: 'SYMBOL_SEARCH',
            keywords,
            apikey: API_KEY,
          },
        })
      );

      const matches = response.data.bestMatches;
      
      if (!matches) {
        return [];
      }

      return matches;
    },
    600000 // 10 minute cache
  );
};

/**
 * Get company overview
 * @param {string} symbol - Stock symbol
 * @returns {Promise<Object>} Company data
 */
export const getCompanyOverview = async (symbol) => {
  const cacheKey = `av_overview_${symbol}`;
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        alphaVantageClient.get('', {
          params: {
            function: 'OVERVIEW',
            symbol,
            apikey: API_KEY,
          },
        })
      );

      const data = response.data;
      
      if (!data || !data.Symbol) {
        throw new Error(`No company data found for symbol: ${symbol}`);
      }

      return data;
    },
    86400000 // 24 hour cache (company data rarely changes)
  );
};

/**
 * Get top gainers and losers
 * @returns {Promise<Object>} Market movers data
 */
export const getTopGainersLosers = async () => {
  const cacheKey = 'av_top_gainers_losers';
  
  return cachedRequest(
    cacheKey,
    async () => {
      const response = await retryRequest(() =>
        alphaVantageClient.get('', {
          params: {
            function: 'TOP_GAINERS_LOSERS',
            apikey: API_KEY,
          },
        })
      );

      return response.data;
    },
    300000 // 5 minute cache
  );
};

export default {
  getQuote,
  getIntraday,
  getDailyTimeSeries,
  getWeeklyTimeSeries,
  getMonthlyTimeSeries,
  searchSymbols,
  getCompanyOverview,
  getTopGainersLosers,
};
