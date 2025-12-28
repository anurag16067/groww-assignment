/**
 * Unified API Service
 * Combines all API services and provides a single interface
 */

import * as alphaVantage from './alphaVantage';
import * as finnhub from './finnhub';
import * as adapters from './adapters';
import { handleAPIError } from './errorHandlers';

/**
 * Get stock quote data
 * @param {string} symbol - Stock symbol
 * @param {string} source - API source ('alphavantage' or 'finnhub')
 * @returns {Promise<Object>} Normalized quote data
 */
export const getStockQuote = async (symbol, source = 'alphavantage') => {
  try {
    let data;
    
    if (source === 'alphavantage') {
      const rawData = await alphaVantage.getQuote(symbol);
      data = adapters.normalizeAlphaVantageQuote(rawData);
    } else if (source === 'finnhub') {
      const rawData = await finnhub.getQuote(symbol);
      data = adapters.normalizeFinnhubQuote(rawData, symbol);
    } else {
      throw new Error(`Unknown source: ${source}`);
    }

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error, `getStockQuote(${symbol})`);
  }
};

/**
 * Get multiple stock quotes
 * @param {Array<string>} symbols - Array of stock symbols
 * @param {string} source - API source
 * @returns {Promise<Array>} Array of normalized quotes
 */
export const getMultipleQuotes = async (symbols, source = 'alphavantage') => {
  const promises = symbols.map(symbol => getStockQuote(symbol, source));
  const results = await Promise.allSettled(promises);
  
  return results
    .filter(result => result.status === 'fulfilled' && result.value.success)
    .map(result => result.value.data);
};

/**
 * Get chart data for a symbol
 * @param {string} symbol - Stock symbol
 * @param {string} interval - Time interval ('daily', 'weekly', 'monthly', 'intraday')
 * @param {string} source - API source
 * @returns {Promise<Object>} Normalized chart data
 */
export const getChartData = async (symbol, interval = 'daily', source = 'alphavantage') => {
  try {
    let data;

    if (source === 'alphavantage') {
      let rawData;
      
      switch (interval) {
        case 'intraday':
          rawData = await alphaVantage.getIntraday(symbol, '5min');
          break;
        case 'weekly':
          rawData = await alphaVantage.getWeeklyTimeSeries(symbol);
          break;
        case 'monthly':
          rawData = await alphaVantage.getMonthlyTimeSeries(symbol);
          break;
        default:
          rawData = await alphaVantage.getDailyTimeSeries(symbol);
      }
      
      data = adapters.normalizeAlphaVantageTimeSeries(rawData);
    } else if (source === 'finnhub') {
      const now = Math.floor(Date.now() / 1000);
      const resolutionMap = {
        'intraday': '5',
        'daily': 'D',
        'weekly': 'W',
        'monthly': 'M',
      };
      
      const resolution = resolutionMap[interval] || 'D';
      const from = now - (365 * 24 * 60 * 60); // 1 year ago
      
      const rawData = await finnhub.getCandles(symbol, resolution, from, now);
      data = adapters.normalizeFinnhubCandles(rawData);
    }

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error, `getChartData(${symbol}, ${interval})`);
  }
};

/**
 * Search for stock symbols
 * @param {string} query - Search query
 * @param {string} source - API source
 * @returns {Promise<Array>} Search results
 */
export const searchStocks = async (query, source = 'alphavantage') => {
  try {
    let data;

    if (source === 'alphavantage') {
      const rawData = await alphaVantage.searchSymbols(query);
      data = adapters.normalizeAlphaVantageSearch(rawData);
    } else if (source === 'finnhub') {
      const rawData = await finnhub.searchSymbols(query);
      data = adapters.normalizeFinnhubSearch(rawData);
    }

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error, `searchStocks(${query})`);
  }
};

/**
 * Get top market movers (gainers, losers)
 * @returns {Promise<Object>} Top movers data
 */
export const getTopMovers = async () => {
  try {
    const rawData = await alphaVantage.getTopGainersLosers();
    const data = adapters.normalizeTopMovers(rawData);
    
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error, 'getTopMovers');
  }
};

/**
 * Get company profile/overview
 * @param {string} symbol - Stock symbol
 * @param {string} source - API source
 * @returns {Promise<Object>} Company data
 */
export const getCompanyInfo = async (symbol, source = 'alphavantage') => {
  try {
    let data;

    if (source === 'alphavantage') {
      const rawData = await alphaVantage.getCompanyOverview(symbol);
      data = adapters.normalizeAlphaVantageOverview(rawData);
    } else if (source === 'finnhub') {
      const rawData = await finnhub.getCompanyProfile(symbol);
      data = adapters.normalizeFinnhubProfile(rawData);
    }

    return { success: true, data };
  } catch (error) {
    return handleAPIError(error, `getCompanyInfo(${symbol})`);
  }
};

/**
 * Get data for finance cards widget
 * @param {Array<string>} symbols - Stock symbols
 * @param {string} source - API source
 * @returns {Promise<Array>} Finance card data
 */
export const getFinanceCardData = async (symbols, source = 'alphavantage') => {
  try {
    const quotes = await getMultipleQuotes(symbols, source);
    const data = adapters.createFinanceCardData(quotes);
    
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error, 'getFinanceCardData');
  }
};

/**
 * Get data for stock table widget
 * @param {Array<string>} symbols - Stock symbols
 * @param {string} source - API source
 * @returns {Promise<Array>} Table data
 */
export const getStockTableData = async (symbols, source = 'alphavantage') => {
  try {
    const quotes = await getMultipleQuotes(symbols, source);
    const data = adapters.createStockTableData(quotes);
    
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error, 'getStockTableData');
  }
};

/**
 * Get data for watchlist widget
 * @param {Array<string>} symbols - Stock symbols
 * @param {string} source - API source
 * @returns {Promise<Array>} Watchlist data
 */
export const getWatchlistData = async (symbols, source = 'alphavantage') => {
  try {
    const quotes = await getMultipleQuotes(symbols, source);
    const data = adapters.createWatchlistData(quotes);
    
    return { success: true, data };
  } catch (error) {
    return handleAPIError(error, 'getWatchlistData');
  }
};

export default {
  getStockQuote,
  getMultipleQuotes,
  getChartData,
  searchStocks,
  getTopMovers,
  getCompanyInfo,
  getFinanceCardData,
  getStockTableData,
  getWatchlistData,
};
