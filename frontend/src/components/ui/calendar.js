import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';

// Lightweight wrapper to align with our app's expected Calendar props
export function Calendar({ mode = 'single', selected, onSelect, month, onMonthChange, disabled, initialFocus, rtl = false, ...restProps }) {
  return (
    <div className="p-3" {...restProps}>
      <div className="px-4">
        <DayPicker
        dir={rtl ? 'rtl' : 'ltr'}
          classNames={{
            day: "rounded-full transition hover:bg-desert-400",
          }}
          modifiersClassNames={{
            selected: "!bg-desert-400 hover:!bg-desert-400",
            today: "!text-desert-600",
            disabled: "!text-[#bfc4ca] hover:!bg-desert-200",
          }}
          mode={mode}
          selected={selected}
          onSelect={onSelect}
          month={month}
          onMonthChange={onMonthChange}
          disabled={disabled}
          initialFocus={initialFocus}
          // Improve default visuals
          showOutsideDays={false}
          weekStartsOn={0}
        />
      </div>
    </div>
  );
}