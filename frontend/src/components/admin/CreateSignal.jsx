import React, { useState } from 'react';
import { useSignals } from '../../context/SignalContext';
import { CURRENCY_PAIRS, TIMEFRAMES } from '../../utils/constants';
import toast from 'react-hot-toast';

const CreateSignal = ({ onSuccess }) => {
  const { createSignal } = useSignals();
  const [formData, setFormData] = useState({
    pair: '',
    type: 'buy',
    entryPrice: '',
    stopLoss: '',
    takeProfit: [''],
    timeframe: 'H1',
    analysis: '',
    accessPlan: 'free',
  });
  const [chartImage, setChartImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleTakeProfitChange = (index, value) => {
    const newTP = [...formData.takeProfit];
    newTP[index] = value;
    setFormData({
      ...formData,
      takeProfit: newTP,
    });
  };

  const addTakeProfit = () => {
    setFormData({
      ...formData,
      takeProfit: [...formData.takeProfit, ''],
    });
  };

  const removeTakeProfit = (index) => {
    if (formData.takeProfit.length > 1) {
      const newTP = formData.takeProfit.filter((_, i) => i !== index);
      setFormData({
        ...formData,
        takeProfit: newTP,
      });
    }
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        setChartImage(file);
        setPreviewUrl(URL.createObjectURL(file));
        e.preventDefault();
        toast.success('Image pasted successfully!');
        break;
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setChartImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setChartImage(null);
    setPreviewUrl(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create FormData properly
      const data = new FormData();
      data.append('pair', formData.pair);
      data.append('type', formData.type);
      data.append('entryPrice', parseFloat(formData.entryPrice));
      data.append('stopLoss', parseFloat(formData.stopLoss));
      data.append('timeframe', formData.timeframe);
      data.append('analysis', formData.analysis);
      data.append('accessPlan', formData.accessPlan);
      
      // Append take profits individually (to handle array in form-data)
      formData.takeProfit
        .map(tp => parseFloat(tp))
        .filter(tp => !isNaN(tp))
        .forEach(tp => data.append('takeProfit', tp));

      if (chartImage) {
        data.append('chartImage', chartImage);
      }

      await createSignal(data);
      toast.success('Signal created successfully!');
      
      // Reset form
      setFormData({
        pair: '',
        type: 'buy',
        entryPrice: '',
        stopLoss: '',
        takeProfit: [''],
        timeframe: 'H1',
        analysis: '',
        accessPlan: 'free',
      });
      setChartImage(null);
      setPreviewUrl(null);

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to create signal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card space-y-6">
      <h2 className="text-2xl font-bold">Create New Signal</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="pair" className="block text-sm font-medium text-gray-700 mb-1">
            Currency Pair *
          </label>
          <select
            id="pair"
            name="pair"
            required
            value={formData.pair}
            onChange={handleChange}
            className="input"
          >
            <option value="">Select Pair</option>
            {CURRENCY_PAIRS.map((pair) => (
              <option key={pair} value={pair}>
                {pair}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Type *
          </label>
          <select
            id="type"
            name="type"
            required
            value={formData.type}
            onChange={handleChange}
            className="input"
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
            <option value="buy limit">Buy Limit</option>
            <option value="sell limit">Sell Limit</option>
          </select>
        </div>

        <div>
          <label htmlFor="entryPrice" className="block text-sm font-medium text-gray-700 mb-1">
            Entry Price *
          </label>
          <input
            id="entryPrice"
            name="entryPrice"
            type="number"
            step="0.00001"
            required
            value={formData.entryPrice}
            onChange={handleChange}
            className="input"
            placeholder="1.12345"
          />
        </div>

        <div>
          <label htmlFor="stopLoss" className="block text-sm font-medium text-gray-700 mb-1">
            Stop Loss *
          </label>
          <input
            id="stopLoss"
            name="stopLoss"
            type="number"
            step="0.00001"
            required
            value={formData.stopLoss}
            onChange={handleChange}
            className="input"
            placeholder="1.12000"
          />
        </div>

        <div>
          <label htmlFor="timeframe" className="block text-sm font-medium text-gray-700 mb-1">
            Timeframe
          </label>
          <select
            id="timeframe"
            name="timeframe"
            value={formData.timeframe}
            onChange={handleChange}
            className="input"
          >
            {TIMEFRAMES.map((tf) => (
              <option key={tf} value={tf}>
                {tf}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Signal Grade *
          </label>
          <div className="flex gap-4 p-1 bg-gray-100 rounded-xl w-fit">
            <button
              type="button"
              onClick={() => setFormData({ ...formData, accessPlan: 'free' })}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                formData.accessPlan === 'free'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Free Signal
            </button>
            <button
              type="button"
              onClick={() => setFormData({ ...formData, accessPlan: 'premium' })}
              className={`px-6 py-2 rounded-lg font-bold transition-all ${
                formData.accessPlan === 'premium'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Premium Only
            </button>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Take Profit Levels *
        </label>
        {formData.takeProfit.map((tp, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="number"
              step="0.00001"
              required
              value={tp}
              onChange={(e) => handleTakeProfitChange(index, e.target.value)}
              className="input flex-1"
              placeholder={`TP ${index + 1}`}
            />
            {formData.takeProfit.length > 1 && (
              <button
                type="button"
                onClick={() => removeTakeProfit(index)}
                className="btn btn-danger"
              >
                Remove
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addTakeProfit}
          className="btn btn-secondary text-sm mt-2"
        >
          + Add Take Profit Level
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Chart Image (Paste or Upload)
        </label>
        
        {/* Paste/Upload Area */}
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary-500 transition-colors cursor-pointer"
          onPaste={handlePaste}
          onClick={() => document.getElementById('chartInput').click()}
        >
          <input
            type="file"
            id="chartInput"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          
          {previewUrl ? (
            <div className="relative inline-block">
              <img 
                src={previewUrl} 
                alt="Chart Preview" 
                className="max-h-64 rounded shadow-md mx-auto"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeImage();
                }}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="text-gray-500">
              <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-1">Click to upload or press Ctrl+V to paste chart</p>
              <p className="text-xs text-gray-400 mt-1">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="analysis" className="block text-sm font-medium text-gray-700 mb-1">
          Analysis (Optional)
        </label>
        <textarea
          id="analysis"
          name="analysis"
          rows="4"
          value={formData.analysis}
          onChange={handleChange}
          className="input"
          placeholder="Enter your analysis or notes..."
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? 'Creating...' : 'Create Signal'}
      </button>
    </form>
  );
};

export default CreateSignal;


