import React, { useEffect, useState } from 'react';
import { useSignals } from '../../context/SignalContext';
import SignalCard from './SignalCard';
import SignalFilters from './SignalFilters';
import Loader from '../common/Loader';

const SignalList = () => {
  const { signals, loading, fetchSignals } = useSignals();
  const [filters, setFilters] = useState({
    status: '',
    pair: '',
    type: '',
    timeframe: '',
    page: 1,
  });
  const [pagination, setPagination] = useState({
    totalPages: 1,
    currentPage: 1,
    total: 0,
  });

  useEffect(() => {
    loadSignals();
  }, [filters]);

  const loadSignals = async () => {
    try {
      const data = await fetchSignals(filters);
      if (data) {
        setPagination({
          totalPages: data.totalPages || 1,
          currentPage: data.currentPage || 1,
          total: data.total || 0,
        });
      }
    } catch (error) {
      console.error('Error loading signals:', error);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters({ ...newFilters, page: 1 });
  };

  const handlePageChange = (page) => {
    setFilters({ ...filters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading && signals.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <SignalFilters filters={filters} onFilterChange={handleFilterChange} />

      {signals.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-500 text-lg">No signals found</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {signals.map((signal) => (
              <SignalCard key={signal._id} signal={signal} />
            ))}
          </div>

          {pagination.totalPages > 1 && (
            <div className="flex justify-center items-center space-x-2">
              <button
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={pagination.currentPage === 1}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="text-sm text-gray-600">
                Page {pagination.currentPage} of {pagination.totalPages}
              </span>
              <button
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={pagination.currentPage === pagination.totalPages}
                className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SignalList;


