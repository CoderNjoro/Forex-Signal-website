export const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPrice = (price) => {
  return parseFloat(price).toFixed(5);
};

export const getStatusColor = (status) => {
  const colors = {
    active: 'bg-green-100 text-green-800',
    closed: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const getResultColor = (result) => {
  const colors = {
    win: 'text-green-600 font-bold',
    loss: 'text-red-600 font-bold',
    breakeven: 'text-yellow-600 font-bold',
    pending: 'text-gray-600',
  };
  return colors[result] || 'text-gray-600';
};

export const getTypeColor = (type) => {
  switch (type) {
    case 'buy':
      return 'bg-green-600 text-white';
    case 'sell':
      return 'bg-red-600 text-white';
    case 'buy limit':
      return 'bg-green-100 text-green-800 border border-green-200';
    case 'sell limit':
      return 'bg-red-100 text-red-800 border border-red-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


