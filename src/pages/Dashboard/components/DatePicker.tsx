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
    <div className="date-picker px-4 bg-white dark:bg-boxdark dark:bg-gray-800 rounded-lg flex gap-4">
      <div>
        <label
          htmlFor="start-date"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          Start Date
        </label>
        <input
          type="date"
          id="start-date"
          value={startDate}
          onChange={handleStartDateChange}
          className="block w-full px-4 rounded-md border-gray-300 dark:border-gray bg-meta-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
      <div>
        <label
          htmlFor="end-date"
          className="block text-sm font-semibold text-gray-700 dark:text-gray-300"
        >
          End Date
        </label>
        <input
          type="date"
          id="end-date"
          value={endDate}
          onChange={handleEndDateChange}
          className="block w-full px-4 rounded-md border-gray-300 dark:border-gray-600 bg-meta-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>
  );
};

export default DatePicker;
