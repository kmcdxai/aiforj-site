/**
 * Slider / Range Input Component
 * Custom styled range input for scales, ratings, intensity levels
 * Shows current value with label
 */

import { useState } from 'react';

export default function Slider({
  label,
  min = 0,
  max = 10,
  value,
  onChange,
  step = 1,
  showValue = true,
  className = '',
  ...props
}) {
  const [internalValue, setInternalValue] = useState(value || min);
  const displayValue = value !== undefined ? value : internalValue;

  const handleChange = (e) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  const sliderStyle = {
    width: '100%',
    height: '6px',
    borderRadius: 'var(--radius-full)',
    backgroundColor: 'var(--parchment-deep)',
    appearance: 'none',
    WebkitAppearance: 'none',
    outline: 'none',
    cursor: 'pointer',
  };

  const containerStyle = {
    width: '100%',
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  };

  const labelStyle = {
    fontSize: '14px',
    fontWeight: 500,
    color: 'var(--text-primary)',
  };

  const valueStyle = {
    fontSize: '14px',
    fontWeight: 600,
    color: 'var(--sage-deep)',
  };

  return (
    <div style={containerStyle} className={className}>
      <div style={headerStyle}>
        {label && (
          <label style={labelStyle}>
            {label}
          </label>
        )}
        {showValue && (
          <span style={valueStyle}>
            {displayValue}
          </span>
        )}
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={displayValue}
        step={step}
        onChange={handleChange}
        style={sliderStyle}
        {...props}
      />
      <style jsx>{`
        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          -webkit-appearance: none;
          width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          background-color: var(--sage-deep);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          border: none;
        }
        input[type="range"]::-webkit-slider-thumb:hover {
          background-color: var(--sage);
          box-shadow: var(--shadow-md);
        }
        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: var(--radius-full);
          background-color: var(--sage-deep);
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          border: none;
        }
        input[type="range"]::-moz-range-thumb:hover {
          background-color: var(--sage);
          box-shadow: var(--shadow-md);
        }
        input[type="range"]::-moz-range-track {
          background: transparent;
          border: none;
        }
      `}</style>
    </div>
  );
}
