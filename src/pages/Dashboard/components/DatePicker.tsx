import React, { useState, ChangeEvent } from 'react';

interface DatePickerProps {
  onStartDateChange: (date: Date | null) => void;
  onEndDateChange: (date: Date | null) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
  onStartDateChange,
  onEndDateChange,
}) => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const handleStartDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setStartDate(date);
    onStartDateChange(date ? new Date(date) : null);
  };

  const handleEndDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const date = event.target.value;
    setEndDate(date);
    onEndDateChange(date ? new Date(date) : null);
  };

  return (
    <div className="date-picker">
      <label
        htmlFor="start-date"
        className="block text-sm font-medium text-gray-700"
      >
        Start Date
      </label>
      <input
        type="date"
        id="start-date"
        value={startDate}
        onChange={handleStartDateChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
      <label
        htmlFor="end-date"
        className="block text-sm font-medium text-gray-700 mt-4"
      >
        End Date
      </label>
      <input
        type="date"
        id="end-date"
        value={endDate}
        onChange={handleEndDateChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>
  );
};

export default DatePicker;
