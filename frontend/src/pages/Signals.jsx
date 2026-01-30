import React from 'react';
import SignalList from '../components/signals/SignalList';

const Signals = () => {
  return (
    <div className="max-w-7xl mx-auto pt-28 px-4 pb-12">
      <div className="mb-6">
        <h1 className="text-4xl font-black mb-2 tracking-tight">Trading Signals</h1>
        <p className="text-gray-500 font-medium font-medium">Browse and filter all available trading signals</p>
      </div>
      <SignalList />
    </div>
  );
};

export default Signals;


