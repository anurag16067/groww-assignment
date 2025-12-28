/**
 * API Response Adapters
 * Normalize responses from different APIs into a consistent format
 */

/**
 * Normalize Alpha Vantage quote to common format
 */
export const normalizeAlphaVantageQuote = (data) => {
  return {
    symbol: data['01. symbol'],
    price: parseFloat(data['05. price']),
    change: parseFloat(data['09. change']),
    changePercent: parseFloat(data['10. change percent'].replace('%', '')),
    volume: parseInt(data['06. volume']),
    high: parseFloat(data['03. high']),
    low: parseFloat(data['04. low']),
    open: parseFloat(data['02. open']),
    previousClose: parseFloat(data['08. previous close']),
    latestTradingDay: data['07. latest trading day'],
  };
};

/**
 * Normalize Finnhub quote to common format
 */
export const normalizeFinnhubQuote = (data, symbol) => {
  const change = data.c - data.pc;
  const changePercent = (change / data.pc) * 100;

  return {
    symbol: symbol,
    price: data.c,
    change: change,
    changePercent: changePercent,
    high: data.h,
    low: data.l,
    open: data.o,
    previousClose: data.pc,
    timestamp: data.t,
  };
};

/**
 * Normalize Alpha Vantage time series to chart data
 */
export const normalizeAlphaVantageTimeSeries = (data) => {
  const chartData = [];

  for (const [date, values] of Object.entries(data)) {
    chartData.push({
      date: date,
      open: parseFloat(values['1. open']),
      high: parseFloat(values['2. high']),
      low: parseFloat(values['3. low']),
      close: parseFloat(values['4. close']),
      volume: parseInt(values['5. volume']),
    });
  }

  // Sort by date ascending
  return chartData.sort((a, b) => new Date(a.date) - new Date(b.date));
};

/**
 * Normalize Finnhub candles to chart data
 */
export const normalizeFinnhubCandles = (data) => {
  const chartData = [];

  for (let i = 0; i < data.t.length; i++) {
    chartData.push({
      date: new Date(data.t[i] * 1000).toISOString().split('T')[0],
      timestamp: data.t[i],
      open: data.o[i],
      high: data.h[i],
      low: data.l[i],
      close: data.c[i],
      volume: data.v[i],
    });
  }

  return chartData;
};

/**
 * Normalize Alpha Vantage search results
 */
export const normalizeAlphaVantageSearch = (matches) => {
  return matches.map((match) => ({
    symbol: match['1. symbol'],
    name: match['2. name'],
    type: match['3. type'],
    region: match['4. region'],
    marketOpen: match['5. marketOpen'],
    marketClose: match['6. marketClose'],
    timezone: match['7. timezone'],
    currency: match['8. currency'],
    matchScore: match['9. matchScore'],
  }));
};

/**
 * Normalize Finnhub search results
 */
export const normalizeFinnhubSearch = (data) => {
  if (!data.result) return [];

  return data.result.map((item) => ({
    symbol: item.symbol,
    name: item.description,
    type: item.type,
    displaySymbol: item.displaySymbol,
  }));
};

/**
 * Normalize Alpha Vantage company overview
 */
export const normalizeAlphaVantageOverview = (data) => {
  return {
    symbol: data.Symbol,
    name: data.Name,
    description: data.Description,
    exchange: data.Exchange,
    currency: data.Currency,
    country: data.Country,
    sector: data.Sector,
    industry: data.Industry,
    marketCap: parseFloat(data.MarketCapitalization),
    peRatio: parseFloat(data.PERatio),
    eps: parseFloat(data.EPS),
    dividendYield: parseFloat(data.DividendYield),
    week52High: parseFloat(data['52WeekHigh']),
    week52Low: parseFloat(data['52WeekLow']),
    fiftyDayMA: parseFloat(data['50DayMovingAverage']),
    twoHundredDayMA: parseFloat(data['200DayMovingAverage']),
  };
};

/**
 * Normalize Finnhub company profile
 */
export const normalizeFinnhubProfile = (data) => {
  return {
    symbol: data.ticker,
    name: data.name,
    country: data.country,
    currency: data.currency,
    exchange: data.exchange,
    industry: data.finnhubIndustry,
    logo: data.logo,
    marketCap: data.marketCapitalization,
    phone: data.phone,
    shareOutstanding: data.shareOutstanding,
    weburl: data.weburl,
    ipo: data.ipo,
  };
};

/**
 * Normalize Finnhub basic financials
 */
export const normalizeFinnhubFinancials = (data) => {
  const metrics = data.metric || {};
  
  return {
    peRatio: metrics.peBasicExclExtraTTM,
    eps: metrics.epsBasicExclExtraItemsTTM,
    dividendYield: metrics.dividendYieldIndicatedAnnual,
    week52High: metrics['52WeekHigh'],
    week52Low: metrics['52WeekLow'],
    beta: metrics.beta,
    marketCap: metrics.marketCapitalization,
    averageVolume: metrics.volumeAvg10D,
  };
};

/**
 * Normalize top gainers/losers from Alpha Vantage
 */
export const normalizeTopMovers = (data) => {
  const normalize = (items) => {
    return items?.map((item) => ({
      symbol: item.ticker,
      name: item.ticker, // Alpha Vantage doesn't provide name in this endpoint
      price: parseFloat(item.price),
      change: parseFloat(item.change_amount),
      changePercent: parseFloat(item.change_percentage.replace('%', '')),
      volume: parseInt(item.volume),
    })) || [];
  };

  return {
    gainers: normalize(data.top_gainers),
    losers: normalize(data.top_losers),
    mostActive: normalize(data.most_actively_traded),
  };
};

/**
 * Create finance card data from normalized quote
 */
export const createFinanceCardData = (quotes) => {
  if (!Array.isArray(quotes)) {
    quotes = [quotes];
  }

  return quotes.map((quote) => ({
    symbol: quote.symbol,
    name: quote.name || quote.symbol,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    volume: quote.volume,
    high: quote.high,
    low: quote.low,
    marketCap: quote.marketCap,
  }));
};

/**
 * Create stock table data from normalized quotes
 */
export const createStockTableData = (quotes) => {
  if (!Array.isArray(quotes)) {
    quotes = [quotes];
  }

  return quotes.map((quote) => ({
    symbol: quote.symbol,
    name: quote.name || quote.symbol,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    volume: quote.volume,
  }));
};

/**
 * Create watchlist data from normalized quotes
 */
export const createWatchlistData = (quotes, additionalData = {}) => {
  if (!Array.isArray(quotes)) {
    quotes = [quotes];
  }

  return quotes.map((quote) => ({
    symbol: quote.symbol,
    name: quote.name || quote.symbol,
    price: quote.price,
    change: quote.change,
    changePercent: quote.changePercent,
    volume: quote.volume,
    high: quote.high,
    low: quote.low,
    marketCap: quote.marketCap,
    pe: quote.peRatio,
    week52High: quote.week52High,
    week52Low: quote.week52Low,
    badge: additionalData[quote.symbol]?.badge,
  }));
};

/**
 * Unified adapter - automatically detects source and normalizes
 */
export const adaptAPIResponse = (data, source, type) => {
  switch (source) {
    case 'alphavantage':
      switch (type) {
        case 'quote':
          return normalizeAlphaVantageQuote(data);
        case 'timeseries':
          return normalizeAlphaVantageTimeSeries(data);
        case 'search':
          return normalizeAlphaVantageSearch(data);
        case 'overview':
          return normalizeAlphaVantageOverview(data);
        case 'topmovers':
          return normalizeTopMovers(data);
        default:
          return data;
      }
    
    case 'finnhub':
      switch (type) {
        case 'quote':
          return normalizeFinnhubQuote(data);
        case 'candles':
          return normalizeFinnhubCandles(data);
        case 'search':
          return normalizeFinnhubSearch(data);
        case 'profile':
          return normalizeFinnhubProfile(data);
        case 'financials':
          return normalizeFinnhubFinancials(data);
        default:
          return data;
      }
    
    default:
      return data;
  }
};

export default {
  normalizeAlphaVantageQuote,
  normalizeFinnhubQuote,
  normalizeAlphaVantageTimeSeries,
  normalizeFinnhubCandles,
  normalizeAlphaVantageSearch,
  normalizeFinnhubSearch,
  normalizeAlphaVantageOverview,
  normalizeFinnhubProfile,
  normalizeFinnhubFinancials,
  normalizeTopMovers,
  createFinanceCardData,
  createStockTableData,
  createWatchlistData,
  adaptAPIResponse,
};
