import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

// Lightweight wrapper to align with our app's expected Calendar props
export function Calendar({ mode = 'single', selected, onSelect, disabled, initialFocus, ...restProps }) {
  return (
    <div className="p-3" {...restProps}>
      <DayPicker
        mode={mode}
        selected={selected}
        onSelect={onSelect}
        disabled={disabled}
        initialFocus={initialFocus}
        // Improve default visuals
        showOutsideDays={false}
        weekStartsOn={0}
        styles={{
          caption: { fontWeight: 600 },
          head_cell: { color: '#6b7280', fontWeight: 500 },
          day_selected: { backgroundColor: '#f59e0b', color: 'white' },
          day_today: { border: '1px solid #f59e0b' },
        }}
      />
    </div>
  );
}