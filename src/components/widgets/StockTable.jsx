import { useState, useMemo } from 'react';
import BaseWidget from './BaseWidget';

/**
 * StockTable - Display stock data in a paginated table with filters and search
 */
const StockTable = ({ data, loading, error, config }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortColumn, setSortColumn] = useState('symbol');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = config?.itemsPerPage || 10;

  // Filter and sort data
  const processedData = useMemo(() => {
    if (!Array.isArray(data)) return [];

    let filtered = data.filter((item) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        item.symbol?.toLowerCase().includes(searchLower) ||
        item.name?.toLowerCase().includes(searchLower) ||
        item.companyName?.toLowerCase().includes(searchLower)
      );
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortColumn];
      let bVal = b[sortColumn];

      // Handle string comparisons
      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal?.toLowerCase() || '';
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [data, searchTerm, sortColumn, sortDirection]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = processedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ column }) => {
    if (sortColumn !== column) {
      return (
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      );
    }
    return sortDirection === 'asc' ? (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <BaseWidget 
      data={data} 
      loading={loading} 
      error={error} 
      config={config}
      emptyMessage="No stock data available"
    >
      <div className="flex flex-col h-full">
        {/* Search Bar */}
        <div className="mb-3">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by symbol or name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-2 pl-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <svg
              className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 dark:bg-gray-700 sticky top-0">
              <tr>
                <th 
                  className="px-3 py-2 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSort('symbol')}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Symbol</span>
                    <SortIcon column="symbol" />
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-left cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center space-x-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Name</span>
                    <SortIcon column="name" />
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-right cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSort('price')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Price</span>
                    <SortIcon column="price" />
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-right cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSort('change')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Change</span>
                    <SortIcon column="change" />
                  </div>
                </th>
                <th 
                  className="px-3 py-2 text-right cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600"
                  onClick={() => handleSort('changePercent')}
                >
                  <div className="flex items-center justify-end space-x-1">
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Change %</span>
                    <SortIcon column="changePercent" />
                  </div>
                </th>
                <th className="px-3 py-2 text-right">
                  <span className="font-semibold text-gray-700 dark:text-gray-200">Volume</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => {
                const isPositive = (item.change || 0) >= 0;
                const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
                
                return (
                  <tr 
                    key={index} 
                    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800"
                  >
                    <td className="px-3 py-3 font-semibold text-gray-900 dark:text-white">
                      {item.symbol || 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-gray-700 dark:text-gray-300">
                      {item.name || item.companyName || 'N/A'}
                    </td>
                    <td className="px-3 py-3 text-right text-gray-900 dark:text-white font-medium">
                      ${(item.price || 0).toFixed(2)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${changeColor}`}>
                      {isPositive ? '+' : ''}{(item.change || 0).toFixed(2)}
                    </td>
                    <td className={`px-3 py-3 text-right font-medium ${changeColor}`}>
                      {isPositive ? '+' : ''}{(item.changePercent || 0).toFixed(2)}%
                    </td>
                    <td className="px-3 py-3 text-right text-gray-700 dark:text-gray-300">
                      {item.volume ? item.volume.toLocaleString() : 'N/A'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, processedData.length)} of {processedData.length}
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border rounded ${
                    currentPage === page
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 dark:text-gray-300"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </BaseWidget>
  );
};

export default StockTable;
