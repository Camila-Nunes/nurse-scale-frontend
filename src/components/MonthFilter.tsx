import React, { useState } from 'react';
import { AiFillCaretLeft, AiFillCaretRight } from "react-icons/ai";

interface MonthFilterProps {
  onChange: (selectedDate: Date) => void;
}

const MonthFilter: React.FC<MonthFilterProps> = ({ onChange }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handlePrevMonth = () => {
    const prevMonth = new Date(selectedDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    setSelectedDate(prevMonth);
    onChange(prevMonth);
  };

  const handleNextMonth = () => {
    const nextMonth = new Date(selectedDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setSelectedDate(nextMonth);
    onChange(nextMonth);
  };

  return (
    <div className="flex items-center justify-center space-x-4">
      <button onClick={handlePrevMonth}>
        <AiFillCaretLeft className="w-6 h-6" />
      </button>
      <div>
        <p className="text-lg font-semibold">
          {selectedDate.toLocaleString('default', { month: 'long' })}{' '}
          {selectedDate.getFullYear()}
        </p>
      </div>
      <button onClick={handleNextMonth}>
        <AiFillCaretRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default MonthFilter;
