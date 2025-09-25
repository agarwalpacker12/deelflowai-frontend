import { useState, useEffect, useCallback } from "react";
import { DollarSign } from "lucide-react";

const PriceRangeSlider = ({
  minValue,
  maxValue,
  onRangeChange,
  min = 0,
  max = 2000000,
  step = 10000,
}) => {
  const [minVal, setMinVal] = useState(minValue || min);
  const [maxVal, setMaxVal] = useState(maxValue || max);

  // Update internal state when props change
  useEffect(() => {
    if (minValue !== undefined) setMinVal(minValue);
    if (maxValue !== undefined) setMaxVal(maxValue);
  }, [minValue, maxValue]);

  // Convert to percentage for slider positioning
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Handle min slider change
  const handleMinChange = (event) => {
    const value = Math.min(Number(event.target.value), maxVal - step);
    setMinVal(value);
    onRangeChange(value, maxVal);
  };

  // Handle max slider change
  const handleMaxChange = (event) => {
    const value = Math.max(Number(event.target.value), minVal + step);
    setMaxVal(value);
    onRangeChange(minVal, value);
  };

  // Handle input changes
  const handleMinInputChange = (event) => {
    const value = Math.min(Number(event.target.value), maxVal - step);
    setMinVal(value);
    onRangeChange(value, maxVal);
  };

  const handleMaxInputChange = (event) => {
    const value = Math.max(Number(event.target.value), minVal + step);
    setMaxVal(value);
    onRangeChange(minVal, value);
  };

  const minPercent = getPercent(minVal);
  const maxPercent = getPercent(maxVal);

  return (
    <div className="space-y-6">
      {/* Range Display */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-100">
        <div className="text-center">
          <p className="text-sm text-green-600 font-medium">Minimum Price</p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(minVal)}
          </p>
        </div>
        <div className="text-green-400">—</div>
        <div className="text-center">
          <p className="text-sm text-green-600 font-medium">Maximum Price</p>
          <p className="text-2xl font-bold text-green-700">
            {formatCurrency(maxVal)}
          </p>
        </div>
      </div>

      {/* Dual Range Slider Container */}
      <div className="relative py-8">
        {/* Track Background */}
        <div className="h-2 bg-gray-200 rounded-lg"></div>

        {/* Active Range Track */}
        <div
          className="absolute top-8 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg"
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        />

        {/* Min Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          step={step}
          onChange={handleMinChange}
          className="absolute top-8 w-full h-2 bg-transparent appearance-none cursor-pointer range-slider-min"
          style={{ zIndex: 1 }}
        />

        {/* Max Range Input */}
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          step={step}
          onChange={handleMaxChange}
          className="absolute top-8 w-full h-2 bg-transparent appearance-none cursor-pointer range-slider-max"
          style={{ zIndex: 2 }}
        />

        {/* Min Value Tooltip */}
        <div
          className="absolute top-0 transform -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-xs rounded-lg shadow-lg pointer-events-none"
          style={{ left: `${minPercent}%` }}
        >
          {formatCurrency(minVal)}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600"></div>
        </div>

        {/* Max Value Tooltip */}
        <div
          className="absolute top-0 transform -translate-x-1/2 px-3 py-1 bg-green-600 text-white text-xs rounded-lg shadow-lg pointer-events-none"
          style={{ left: `${maxPercent}%` }}
        >
          {formatCurrency(maxVal)}
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-green-600"></div>
        </div>
      </div>

      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            Min Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={minVal}
              onChange={handleMinInputChange}
              min={min}
              max={maxVal - step}
              step={step}
              className="w-full pl-10 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>

        <div>
          <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
            <DollarSign className="w-4 h-4 mr-2 text-green-600" />
            Max Price
          </label>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="number"
              value={maxVal}
              onChange={handleMaxInputChange}
              min={minVal + step}
              max={max}
              step={step}
              className="w-full pl-10 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 transition-all duration-200 focus:border-green-500 focus:bg-white focus:shadow-lg focus:ring-4 focus:ring-green-100"
            />
          </div>
        </div>
      </div>

      <style jsx>{`
        .range-slider-min::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
          pointer-events: all;
          position: relative;
          z-index: 2;
        }

        .range-slider-min::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
        }

        .range-slider-min::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }

        .range-slider-max::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #059669;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
          pointer-events: all;
          position: relative;
          z-index: 1;
        }

        .range-slider-max::-webkit-slider-thumb:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 16px rgba(5, 150, 105, 0.4);
        }

        .range-slider-max::-webkit-slider-thumb:active {
          transform: scale(0.95);
        }

        .range-slider-min::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #10b981;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .range-slider-max::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #059669;
          border: 2px solid #ffffff;
          box-shadow: 0 4px 12px rgba(5, 150, 105, 0.3);
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .range-slider-min::-moz-range-track,
        .range-slider-max::-moz-range-track {
          background: transparent;
          border: none;
        }

        /* Ensure proper event handling for overlapping sliders */
        .range-slider-min {
          pointer-events: none;
        }

        .range-slider-min::-webkit-slider-thumb {
          pointer-events: all;
        }

        .range-slider-max {
          pointer-events: none;
        }

        .range-slider-max::-webkit-slider-thumb {
          pointer-events: all;
        }
      `}</style>
    </div>
  );
};

export default PriceRangeSlider;
