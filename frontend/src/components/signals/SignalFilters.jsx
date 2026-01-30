import React from 'react';
import { CURRENCY_PAIRS, TIMEFRAMES, SIGNAL_STATUS } from '../../utils/constants';

const SignalFilters = ({ filters, onFilterChange }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({
      ...filters,
      [name]: value,
    });
  };

  const clearFilters = () => {
    onFilterChange({
      status: '',
      pair: '',
      type: '',
      timeframe: '',
      page: 1,
    });
  };

  return (
    <div className="card">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="input"
          >
            <option value="">All Status</option>
            <option value={SIGNAL_STATUS.ACTIVE}>Active</option>
            <option value={SIGNAL_STATUS.CLOSED}>Closed</option>
            <option value={SIGNAL_STATUS.CANCELLED}>Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="pair" className="block text-sm font-medium text-gray-700 mb-1">
            Currency Pair
          </label>
          <select
            id="pair"
            name="pair"
            value={filters.pair}
            onChange={handleChange}
            className="input"
          >
            <option value="">All Pairs</option>
            {CURRENCY_PAIRS.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            id="type"
            name="type"
            value={filters.type}
            onChange={handleChange}
            className="input"
          >
            <option value="">All Types</option>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>

        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
            Timeframe
          </label>
          <select
            id="timeframe"
            name="timeframe"
            value={filters.timeframe}
            onChange={handleChange}
            className="input"
          >
            <option value="">All Timeframes</option>
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <button
          onClick={clearFilters}
          className="btn btn-secondary text-sm"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default SignalFilters;


